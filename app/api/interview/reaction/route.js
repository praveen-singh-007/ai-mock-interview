import { NextResponse }
  from "next/server";
  import { INTERVIEW_PROMPT } from "@/lib/prompts/interviewPrompt";

import OpenAI from "openai";

const client = new OpenAI({
  apiKey:
    process.env.GROQ_API_KEY,

  baseURL:
    "https://api.groq.com/openai/v1",
});

export async function POST(req) {

  try {

    const {
      question,
      answer,
    } = await req.json();

    const completion =
  await client.chat.completions.create({

    model:
      "llama-3.3-70b-versatile",

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "system",

        content:
          INTERVIEW_PROMPT,
      },

      {
        role: "user",

        content: `
Question:
${question}

Candidate Answer:
${answer}
`,
      },
    ],

    temperature: 0.2,

    max_tokens: 80,
  });

    const parsed =
  JSON.parse(
    completion.choices[0]
      .message.content
  );

return NextResponse.json({
  success: true,

  reaction:
    parsed.reaction,

  moveNext:
    parsed.moveNext,
});

  } catch (error) {

    console.log(
      "REACTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
      },

      {
        status: 500,
      }
    );
  }
}