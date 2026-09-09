import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAnalyticsEvent } from "./analytics";

test("measurement accepts only a fixed vocabulary, never form values or arbitrary URLs", () => {
  assert.deepEqual(parseAnalyticsEvent({ name: "cta_click", properties: { location: "hero" } }), {
    name: "cta_click", properties: { location: "hero" },
  });
  for (const destination of ["contact", "projects"] as const) {
    assert.deepEqual(parseAnalyticsEvent({ name: "cta_click", properties: { location: "hero", destination } }), {
      name: "cta_click", properties: { location: "hero", destination },
    });
  }
  for (const properties of [
    { email: "visitor@example.test" }, { project: "private-project" },
    { location: "/?email=visitor@example.test" }, { code: "a free-form message" },
    { destination: "/?email=visitor@example.test" }, { destination: "checkout" },
    { destination: ["contact"] },
    { __proto__: null, constructor: "leak" },
  ]) assert.equal(parseAnalyticsEvent({ name: "cta_click", properties }), null);
  assert.equal(parseAnalyticsEvent({ name: "contact_provider_accepted", properties: {} }), null);
  assert.equal(parseAnalyticsEvent({ name: "cta_click", properties: {}, message: "private" }), null);
});
