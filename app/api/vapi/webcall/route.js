import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, userid } = await req.json();

    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "webCall",
        workflowId: process.env.VAPI_WORKFLOW_ID,
        assistantOverrides: {
          variableValues: {
            username,
            userid, // ok if undefined/null
          },
        },
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.log("WEBCALL ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
