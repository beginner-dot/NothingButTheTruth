"use client";

import { useState } from "react";

export default function AdminPage() {
  const [payload, setPayload] = useState('{"action":"update-module"}');
  const [response, setResponse] = useState("No submission yet.");

  const submit = async () => {
    const parsed = JSON.parse(payload);
    const result = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    const body = await result.json();
    setResponse(JSON.stringify(body, null, 2));
  };

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-3xl font-bold">Admin CMS (Stub)</h1>
      <p className="text-sm text-slate-700">Role-based content management surface for modules, lessons, resources, and quizzes.</p>
      <textarea className="min-h-32 w-full rounded border border-slate-300 p-3 font-mono text-sm" value={payload} onChange={(event) => setPayload(event.target.value)} />
      <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white" onClick={submit}>Submit to Admin API</button>
      <pre className="overflow-auto rounded bg-slate-950 p-4 text-xs text-slate-100">{response}</pre>
    </div>
  );
}
