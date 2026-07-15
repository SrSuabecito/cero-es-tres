import { createFalClient } from "@fal-ai/client";

let client: ReturnType<typeof createFalClient> | null = null;

export function getFalClient() {
  if (!client) {
    client = createFalClient({ credentials: process.env.FAL_KEY });
  }
  return client;
}
