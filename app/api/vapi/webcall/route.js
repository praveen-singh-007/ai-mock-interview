import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, userid } = await req.json();

  const resp = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workflowId: process.env.VAPI_WORKFLOW_ID,
      assistantOverrides: {
        variableValues: { username, userid },
      },
      transport: { provider: "web" }, // <-- key change
    }),
  });

  const data = await resp.json();
  return NextResponse.json(data, { status: resp.status });
}
