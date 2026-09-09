import assert from "node:assert/strict";
import { test } from "node:test";
import { projects } from "../data/projects";
import { CONTACT_PROJECTS, getContactContext } from "./contact";
import { parseAnalyticsEvent } from "./analytics";

test("every gallery case preserves its reference through contact and measurement", () => {
  const visible = projects.filter((project) => project.gallery);
  assert.equal(new Set(visible.map((project) => project.slug)).size, visible.length);
  for (const { slug } of visible) {
    assert.ok(Object.hasOwn(CONTACT_PROJECTS, slug));
    assert.equal(getContactContext("", slug).proyecto, slug);
    assert.equal(parseAnalyticsEvent({ name: "case_view", properties: { project: slug } })?.properties.project, slug);
    assert.equal(parseAnalyticsEvent({ name: "form_start", properties: { project: slug, location: "contact" } })?.properties.project, slug);
  }
});
