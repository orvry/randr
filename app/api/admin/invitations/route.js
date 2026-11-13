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
    provided.length === expected.length && timingSafeEqual(provided, expected)
  );
}

function parseGuests(input) {
  if (typeof input !== "string") {
    return { error: "Enter guests as one “Name, email” pair per line." };
  }

  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
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
    const email = line
      .slice(comma + 1)
      .trim()
      .toLowerCase();
    if (
      !name ||
      name.length > 120 ||
      email.length > 254 ||
      !EMAIL_PATTERN.test(email)
    ) {
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

function getSiteOrigin() {
  const configuredUrl = process.env.SITE_URL;
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
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
    subject: "Russelle & Rosie are getting married",
    html: `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light" />
          <title>Russelle &amp; Rosie are getting married</title>
        </head>
        <body style="margin:0;padding:0;background-color:#DFDED9;color:#2b3014;font-family:Arial,Helvetica,sans-serif;">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
            You’re invited to celebrate with Russelle and Rosie on March 21, 2027.
          </div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#DFDED9;">
            <tr>
              <td align="center" style="padding:36px 14px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#f3f2ec;">
                  <tr>
                    <td align="center" bgcolor="#5F6831" style="padding:42px 28px 38px;background-color:#5F6831;color:#f5f4ef;">
                      <p style="margin:0 0 16px;color:#e6bf99;font-size:11px;font-weight:bold;letter-spacing:4px;text-transform:uppercase;">
                        A garden celebration
                      </p>
                      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:42px;font-weight:normal;line-height:1.15;letter-spacing:-1px;">
                        Russelle <span style="color:#e6bf99;">&amp;</span> Rosie
                      </h1>
                      <p style="margin:12px 0 0;color:#f5f4ef;font-family:Georgia,'Times New Roman',serif;font-size:21px;">
                        are getting married
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:38px 34px 12px;">
                      <p style="margin:0 0 12px;color:#9A7A54;font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">
                        With love, we invite you
                      </p>
                      <h2 style="margin:0 0 18px;color:#2b3014;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:normal;line-height:1.3;">
                        Dear ${safeName},
                      </h2>
                      <p style="max-width:440px;margin:0 auto;color:#5b5a4b;font-size:16px;line-height:1.8;">
                        Our story wouldn’t be complete without the people we love. Join us for a garden celebration as we begin our forever.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 34px 8px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #cbc9c0;border-bottom:1px solid #cbc9c0;">
                        <tr>
                          <td align="center" style="padding:21px 10px;">
                            <p style="margin:0 0 7px;color:#5F6831;font-size:10px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">When</p>
                            <p style="margin:0;color:#2b3014;font-family:Georgia,'Times New Roman',serif;font-size:20px;">Sunday, March 21, 2027 · 5:00 PM</p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:0 10px 21px;">
                            <p style="margin:0 0 7px;color:#5F6831;font-size:10px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">Where</p>
                            <p style="margin:0;color:#2b3014;font-family:Georgia,'Times New Roman',serif;font-size:18px;">Metro Manila, Philippines</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:28px 28px 12px;">
                      <p style="margin:0 0 20px;color:#5b5a4b;font-size:15px;line-height:1.6;">
                        Kindly let us know if you’ll be there.
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" bgcolor="#9A7A54" style="background-color:#9A7A54;">
                            <a href="${safeLink}" style="display:inline-block;padding:16px 30px;border:1px solid #9A7A54;color:#ffffff;font-size:12px;font-weight:bold;letter-spacing:2px;text-decoration:none;text-transform:uppercase;">
                              Reply to the invitation
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:18px 0 0;color:#6b6a5a;font-size:12px;line-height:1.6;">
                        This personal link can be used once and expires ${escapeHtml(expiryLabel)}.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" bgcolor="#5F6831" style="padding:25px 20px;background-color:#5F6831;color:#f5f4ef;">
                      <p style="margin:0;color:#e6bf99;font-family:Georgia,'Times New Roman',serif;font-size:19px;">
                        With love, Russelle &amp; Rosie
                      </p>
                      <p style="margin:9px 0 0;color:#e9e8df;font-size:10px;letter-spacing:2px;text-transform:uppercase;">
                        March 21, 2027 · Metro Manila
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
    text: `Dear ${guest.name},

Russelle & Rosie are getting married, and we’d love for you to join us for a garden celebration.

Sunday, March 21, 2027 at 5:00 PM
Metro Manila, Philippines

Please reply using your personal link:
${link}

This link can be used once and expires ${expiryLabel}.

With love,
Russelle & Rosie`,
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
    return NextResponse.json(
      { error: "Admin access is not configured" },
      {
        status: 503,
      },
    );
  }
  if (!isAuthorized(request, adminKey)) {
    return NextResponse.json(
      { error: "Admin key is incorrect" },
      {
        status: 401,
      },
    );
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
  if (
    !expiresAt ||
    Number.isNaN(expiresAt.getTime()) ||
    expiresAt <= new Date()
  ) {
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

  const siteOrigin = getSiteOrigin();
  if (!siteOrigin) {
    return NextResponse.json(
      {
        error:
          "Set SITE_URL to the public website URL before sending invitations",
      },
      { status: 503 },
    );
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const baseUrl = new URL("/", siteOrigin);
  const invitations = parsed.guests.map((guest) => {
    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const link = new URL(baseUrl);
    link.searchParams.set("token", token);
    //link.hash = "rsvp";

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
