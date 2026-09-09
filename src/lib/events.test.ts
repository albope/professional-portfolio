import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "../app/api/events/route";

test("event endpoint rejects personal data, foreign origins and oversized bodies without logging them", async () => {
  const logs: unknown[] = [];
  const original = console.info;
  console.info = (entry: unknown) => { logs.push(entry); };
  const request = (body: string, headers: Record<string, string> = {}) => new Request("https://bpm.example/api/events", {
    method: "POST", headers: { "Content-Type": "application/json", ...headers }, body,
  });
  try {
    const pii = JSON.stringify({ name: "form_start", properties: { email: "private@example.test" } });
    assert.equal((await POST(request(pii))).status, 400);
    assert.equal((await POST(request("a".repeat(1_025)))).status, 413);
    const valid = JSON.stringify({ name: "cta_click", properties: { location: "hero" } });
    assert.equal((await POST(request(valid, { Origin: "https://foreign.example" }))).status, 403);
    assert.equal((await POST(request(valid, { "Sec-GPC": "1" }))).status, 204);
    assert.equal(logs.length, 0);
    assert.equal((await POST(request(valid))).status, 204);
    assert.deepEqual(JSON.parse(String(logs[0])), { stream: "bpm-events", name: "cta_click", properties: { location: "hero" } });
    const proxied = (origin: string, site = "same-origin") => new Request("http://localhost:3000/api/events", {
      method: "POST", body: valid,
      headers: { "Content-Type": "application/json", Host: "preview.example", "X-Forwarded-Proto": "https", Origin: origin, "Sec-Fetch-Site": site },
    });
    assert.equal((await POST(proxied("https://preview.example"))).status, 204);
    assert.equal(logs.length, 2);
    assert.equal((await POST(proxied("https://foreign.example"))).status, 403);
    assert.equal((await POST(proxied("http://localhost:3000"))).status, 403);
    assert.equal((await POST(proxied("https://preview.example", "cross-site"))).status, 403);
    assert.equal(logs.length, 2);
  } finally { console.info = original; }
});
