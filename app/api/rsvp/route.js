import { NextResponse } from "next/server";
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

  const { error } = await supabase.from("rsvps").insert(row);
  if (error) {
    console.error("RSVP insert failed:", error.message);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
