import { createContactHandler } from "@/lib/contact-server";

export const runtime = "nodejs";
export const POST = createContactHandler({
  onAccepted: ({ providerId, need, project }) => {
    // Deduplicate by providerId when querying; a retry can log the same acceptance.
    console.info(JSON.stringify({ stream: "bpm-contact", event: "provider_accepted", providerId, need, project }));
  },
});
