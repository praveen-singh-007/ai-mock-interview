import { NextResponse } from "next/server";
import OpenAI from "openai";

import { SYSTEM_PROMPT } from "@/lib/prompts/systemPrompt";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const completion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0.7,

        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },

          ...messages,
        ],
      });

    const response =
      completion.choices[0].message.content;

    const completed =
      response.includes("COMPLETED:true");

    const stateMatch =
      response.match(/STATE:({[\s\S]*})/);

    let state = {};

    if (stateMatch?.[1]) {
      try {
        state = JSON.parse(stateMatch[1]);
      } catch (e) {
        console.log("STATE PARSE ERROR:", e);
      }
    }

    const cleanReply = response
      .replace(/COMPLETED:(true|false)/g, "")
      .replace(/STATE:({[\s\S]*})/g, "")
      .trim();

    return NextResponse.json({
      success: true,
      reply: cleanReply,
      completed,
      state,
    });
  } catch (error) {
    console.log("CHAT API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Chat failed",
      },
      {
        status: 500,
      }
    );
  }
}