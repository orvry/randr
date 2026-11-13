import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getAdminClient } from "../../../lib/supabase-admin";

export const runtime = "nodejs";

const ALLERGIES = ["Seafood", "Peanuts", "Dairy", "Gluten"];
const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const token = clean(body.token, 200);
  if (!token) {
    return NextResponse.json(
      {
        error:
          "This RSVP link is missing, invalid, expired, or already used. Please request another link from the couple.",
      },
      { status: 403 },
    );
  }

  const name = clean(body.guest_name, 120);
  const email = clean(body.email, 200);
  const attending = body.attendance;
  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !["accept", "decline"].includes(attending)
  ) {
    return NextResponse.json(
      { error: "Please check your details" },
      { status: 400 },
    );
  }
  const declined = attending === "decline";

  const row = {
    guest_name: name,
    email,
    phone: clean(body.phone, 40) || null,
    attendance: attending,
    allergies:
      declined || !Array.isArray(body.allergies)
        ? []
        : body.allergies.filter((a) => ALLERGIES.includes(a)),
    dietary_requirements: declined
      ? null
      : clean(body.dietary_requirements, 1000) || null,
    message: clean(body.message, 2000) || null,
  };

  const supabase = getAdminClient();
  if (!supabase)
    return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { data: accepted, error } = await supabase.rpc("submit_rsvp_once", {
    p_token_hash: tokenHash,
    p_rsvp: row,
  });
  if (error) {
    console.error("RSVP submission failed:", error.message);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
  if (!accepted) {
    return NextResponse.json(
      {
        error:
          "This RSVP link is missing, invalid, expired, or already used. Please request another link from the couple.",
      },
      { status: 403 },
    );
  }
  return NextResponse.json({ ok: true });
}
