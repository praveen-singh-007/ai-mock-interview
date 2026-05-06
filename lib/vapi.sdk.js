"use client";

import Vapi from "@vapi-ai/web";

const publicKey = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!publicKey) {
  throw new Error("Missing NEXT_PUBLIC_VAPI_WEB_TOKEN");
}

export const vapi = new Vapi(publicKey);
