"use client";
import { useState } from "react";
import Drift from "./Drift";
import Reveal from "./Reveal";
import Words from "./Words";

const ALLERGIES = ["Seafood", "Peanuts", "Dairy", "Gluten"];

export default function RsvpSection() {
  const [open, setOpen] = useState(true);
  const [attending, setAttending] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [done, setDone] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("");
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const f = new FormData(form);
    const declined = f.get("attending") === "decline";
    const payload = {
      guest_name: f.get("name").trim(),
      email: f.get("email").trim(),
      phone: (f.get("phone") || "").trim() || null,
      attendance: f.get("attending"),
      allergies: declined ? [] : f.getAll("allergy"),
      dietary_requirements: declined
        ? null
        : (f.get("dietary_notes") || "").trim() || null,
      message: (f.get("message") || "").trim() || null,
    };

    setSending(true);
    let res;
    try {
      res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      res = null;
    }
    setSending(false);
    if (!res || !res.ok) {
      setStatus(
        res && res.status === 503
          ? "RSVP isn’t connected yet. Add your Supabase keys to .env.local and restart."
          : "Something went wrong. Please try again in a moment.",
      );
      return;
    }
    setDone({ declined, first: payload.guest_name.split(" ")[0] });
  }

  return (
    <section id="rsvp" className="rsvp">
      <Drift count={14} />
      <Reveal className="content rsvp-grid">
        <div>
          <div className="eyebrow" style={{ color: "#e6bf99" }}>
            The next chapter starts here
          </div>
          <h2>
            <Words>And then,</Words>{" "}
            <em>
              <Words start={2}>we do.</Words>
            </em>
          </h2>
          <p className="lead">
            We’d love for you to be there when our garden of two becomes a
            gathering of everyone we love.
          </p>
        </div>

        <div>
          <div className="meta">
            <div>
              <small>When</small>Sunday · 3:00 PM
            </div>
            <div>
              <small>Where</small>Metro Manila, Philippines
            </div>
          </div>

          <div className="rsvp-card">
            <button
              type="button"
              className="card-head"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <span>
                <small>Kindly reply</small>
                <b>Save your place</b>
              </span>
              <i aria-hidden="true">{open ? "–" : "+"}</i>
            </button>

            {done ? (
              <div className="thanks">
                <h3>
                  {done.declined ? "We’ll miss you" : "See you in the garden!"}
                </h3>
                <p>
                  {done.declined
                    ? `Thank you for letting us know, ${done.first}. You’ll be in our hearts on the day.`
                    : `Thank you, ${done.first}. Your place is saved and we can’t wait to celebrate with you.`}
                </p>
              </div>
            ) : (
              <form className="card-body" hidden={!open} onSubmit={onSubmit}>
                <label>
                  Guest name *
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                  />
                </label>
                <label>
                  Email address *
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Mobile number
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="Optional"
                  />
                </label>

                <fieldset>
                  <legend>Will you join us? *</legend>
                  <div className="two">
                    <label className="opt">
                      <input
                        type="radio"
                        name="attending"
                        value="accept"
                        required
                        onChange={(e) => setAttending(e.target.value)}
                      />
                      <span>Joyfully accept</span>
                    </label>
                    <label className="opt">
                      <input
                        type="radio"
                        name="attending"
                        value="decline"
                        onChange={(e) => setAttending(e.target.value)}
                      />
                      <span>Regretfully decline</span>
                    </label>
                  </div>
                </fieldset>

                <div id="diet" hidden={attending === "decline"}>
                  <fieldset>
                    <legend>Food allergies</legend>
                    <div className="chips">
                      {ALLERGIES.map((a) => (
                        <label className="chip" key={a}>
                          <input type="checkbox" name="allergy" value={a} />
                          <span>{a}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label>
                    Dietary notes
                    <textarea
                      name="dietary_notes"
                      rows={2}
                      placeholder="Anything we should know?"
                    />
                  </label>
                </div>

                <label>
                  A note for the couple
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="We’d love to hear from you."
                  />
                </label>

                <button className="send" type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Send your reply"}
                </button>
                <p className="status" role="status" aria-live="polite">
                  {status}
                </p>
                <p className="fine">
                  Your reply will be shared with the couple for wedding
                  planning.
                </p>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
