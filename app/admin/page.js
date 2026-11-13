"use client";

import { useState } from "react";

function defaultExpiry() {
  const date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function currentDateTime() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [expiresAt, setExpiresAt] = useState(defaultExpiry);
  const [guests, setGuests] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setResults([]);
    setStatus("");
    setSending(true);

    try {
      const response = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          guests,
          expires_at: new Date(expiresAt).toISOString(),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setStatus(result.error || "Could not create the invitation link.");
        return;
      }
      setResults(result.results);
      const sent = result.results.filter((item) => item.status === "sent").length;
      const failed = result.results.length - sent;
      setStatus(
        `${sent} invitation${sent === 1 ? "" : "s"} sent${
          failed ? `; ${failed} failed` : ""
        }.`,
      );
    } catch {
      setStatus("Could not reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-card">
        <p className="eyebrow">Wedding RSVP</p>
        <h1>Email invitation links</h1>
        <p>
          Each guest receives a personal link that can submit one RSVP and
          expires on the date you choose.
        </p>
        <form onSubmit={onSubmit}>
          <label>
            Admin access key
            <input
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <label>
            Guests
            <textarea
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              placeholder={"Alex Smith, alex@example.com\nJamie Lee, jamie@example.com"}
              rows={7}
              required
            />
            <small>One guest per line, in the format: Name, email (up to 100).</small>
          </label>
          <label>
            Valid until
            <input
              type="datetime-local"
              value={expiresAt}
              min={currentDateTime()}
              onChange={(event) => setExpiresAt(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={sending}>
            {sending ? "Sending invitations…" : "Send invitations"}
          </button>
        </form>
        <p className="admin-status" role="status" aria-live="polite">
          {status}
        </p>
        {results.length > 0 && (
          <ul className="invitation-results" aria-label="Invitation delivery results">
            {results.map((result) => (
              <li key={result.email} data-status={result.status}>
                <span>{result.name} · {result.email}</span>
                <b>{result.status === "sent" ? "Sent" : result.error}</b>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
