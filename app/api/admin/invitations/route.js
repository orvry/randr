import { timingSafeEqual, randomBytes, createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminClient } from "../../../../lib/supabase-admin";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_GUESTS = 100;

function isAuthorized(request, configuredKey) {
  const providedKey = request.headers.get("x-admin-key") || "";
  const provided = Buffer.from(providedKey);
  const expected = Buffer.from(configuredKey);
  return (
    provided.length === expected.length &&
    timingSafeEqual(provided, expected)
  );
}

function parseGuests(input) {
  if (typeof input !== "string") {
    return { error: "Enter guests as one “Name, email” pair per line." };
  }

  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) {
    return { error: "Enter at least one guest." };
  }
  if (lines.length > MAX_GUESTS) {
    return { error: `Send no more than ${MAX_GUESTS} invitations at a time.` };
  }

  const guests = [];
  const lineErrors = [];
  const seenEmails = new Set();

  for (const [index, line] of lines.entries()) {
    const comma = line.lastIndexOf(",");
    if (comma < 1) {
      lineErrors.push(index + 1);
      continue;
    }

    const name = line.slice(0, comma).trim();
    const email = line.slice(comma + 1).trim().toLowerCase();
    if (!name || name.length > 120 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      lineErrors.push(index + 1);
      continue;
    }
    if (seenEmails.has(email)) {
      return { error: `The email address ${email} appears more than once.` };
    }

    seenEmails.add(email);
    guests.push({ name, email });
  }

  if (lineErrors.length) {
    return {
      error: `Check line${lineErrors.length === 1 ? "" : "s"} ${lineErrors.join(", ")}. Use “Name, email” for each guest.`,
    };
  }
  return { guests };
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function createInvitationEmail({ from, guest, link, expiresAt }) {
  const safeName = escapeHtml(guest.name);
  const safeLink = escapeHtml(link);
  const expiryLabel = `${expiresAt.toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  })} UTC`;

  return {
    from,
    to: [guest.email],
    subject: "Your wedding RSVP invitation",
    html: `<p>Dear ${safeName},</p>
      <p>We would love for you to join us. Please use your personal link to send your RSVP:</p>
      <p><a href="${safeLink}">Reply to the invitation</a></p>
      <p>This link can be used once and expires on ${escapeHtml(expiryLabel)}.</p>
      <p>With love,<br />Russelle &amp; Rosie</p>`,
  };
}

async function sendInvitationBatch(apiKey, emails) {
  let response;
  try {
    response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify(emails),
    });
  } catch (error) {
    console.error("Invitation email batch request failed:", error.message);
    return {
      error: "Could not connect to the email provider.",
      accepted: [],
    };
  }

  let providerResult = null;
  try {
    providerResult = await response.json();
  } catch {
    // The status code is enough to report a failed provider response.
  }

  if (!response.ok) {
    console.error(
      "Invitation email batch rejected:",
      providerResult?.message || response.status,
    );
    return {
      error: `Email provider rejected the batch (HTTP ${response.status}).`,
      accepted: [],
    };
  }

  const data = Array.isArray(providerResult?.data) ? providerResult.data : [];
  return {
    accepted: emails.map((_, index) => typeof data[index]?.id === "string"),
    error: "Email provider did not confirm this message.",
  };
}

export async function POST(request) {
  const adminKey = process.env.ADMIN_ACCESS_KEY;
  if (!adminKey) {
    return NextResponse.json({ error: "Admin access is not configured" }, {
      status: 503,
    });
  }
  if (!isAuthorized(request, adminKey)) {
    return NextResponse.json({ error: "Admin key is incorrect" }, {
      status: 401,
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const expiresAt =
    typeof body.expires_at === "string" ? new Date(body.expires_at) : null;
  if (!expiresAt || Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
    return NextResponse.json(
      { error: "Choose a validity date in the future" },
      { status: 400 },
    );
  }

  const parsed = parseGuests(body.guests);
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.INVITATION_FROM_EMAIL;
  if (!resendApiKey || !from) {
    return NextResponse.json(
      { error: "Email sending is not configured" },
      { status: 503 },
    );
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const baseUrl = new URL("/", request.url);
  const invitations = parsed.guests.map((guest) => {
    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const link = new URL(baseUrl);
    link.searchParams.set("token", token);
    link.hash = "rsvp";

    return {
      guest,
      tokenHash,
      row: {
        token_hash: tokenHash,
        guest_name: guest.name,
        email: guest.email,
        expires_at: expiresAt.toISOString(),
        is_valid: true,
      },
      email: createInvitationEmail({
        from,
        guest,
        link: link.toString(),
        expiresAt,
      }),
    };
  });

  const { error: insertError } = await supabase
    .from("invitation_tokens")
    .insert(invitations.map((invitation) => invitation.row));
  if (insertError) {
    console.error("Invitation token creation failed:", insertError.message);
    return NextResponse.json(
      { error: "Could not create invitation links" },
      { status: 500 },
    );
  }

  const delivery = await sendInvitationBatch(
    resendApiKey,
    invitations.map((invitation) => invitation.email),
  );
  const failedInvitations = invitations.filter(
    (_, index) => !delivery.accepted[index],
  );

  let invalidationError = null;
  if (failedInvitations.length) {
    const result = await supabase
      .from("invitation_tokens")
      .update({ is_valid: false })
      .in(
        "token_hash",
        failedInvitations.map((invitation) => invitation.tokenHash),
      )
      .eq("is_valid", true);
    invalidationError = result.error;
    if (invalidationError) {
      console.error(
        "Failed to invalidate undelivered invitation tokens:",
        invalidationError.message,
      );
    }
  }

  const results = invitations.map(({ guest }, index) => {
    if (delivery.accepted[index]) {
      return { name: guest.name, email: guest.email, status: "sent" };
    }
    return {
      name: guest.name,
      email: guest.email,
      status: "failed",
      error: invalidationError
        ? "Email delivery failed and the token could not be invalidated. Contact the site admin."
        : delivery.error,
    };
  });

  return NextResponse.json({ results });
}
