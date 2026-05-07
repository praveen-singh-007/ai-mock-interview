import { db } from "@/firebase/admin";
import { NextResponse } from "next/server";
import { getCompanyLogo } from "@/lib/utils";

import OpenAI from "openai";

const client = new OpenAI({

    apiKey: process.env.GROQ_API_KEY,

    baseURL: "https://api.groq.com/openai/v1",

});

export async function GET() {

    return NextResponse.json({

        success: true,
        data: "API is working",

    });
}

export async function POST(request) {

    try {

        const {
            role,
            type,
            company,
            level,
            techstack,
            amount,
            userid,
        } = await request.json();

        console.log("BODY RECEIVED:", {

            role,
            type,
            company,
            level,
            techstack,
            amount,
            userid,

        });

        const completion =
            await client.chat.completions.create({

                model: "llama-3.3-70b-versatile",

                messages: [

                    {
                        role: "system",

                        content: `
You are an expert technical interviewer.

Generate concise, realistic, high-quality interview questions.

Rules:
- Questions must match the role, company, level, and tech stack.
- Prefer practical and industry-style questions.
- Do not generate answers.
- Do not use markdown.
- Do not number questions.
- Return one question per line only.
`,
                    },

                    {
                        role: "user",

                        content: `
Generate ${amount} interview questions.

Role: ${role}
Company: ${company}
Experience Level: ${level}
Interview Type: ${type}
Tech Stack: ${techstack}
`,
                    },
                ],

                temperature: 0.7,

                max_tokens: 700,
            });

        const text =
            completion.choices[0].message.content;

        console.log("RAW MODEL RESPONSE:", text);

        const questions = text
            .split("\n")
            .map((question) => question.trim())
            .filter(
                (question) => question.length > 10
            );

        console.log("PARSED QUESTIONS:", questions);

        const interview = {

            role,

            type: type || "Technical",

            company,

            level,

            techstack: techstack
                .split(",")
                .map((item) => item.trim()),

            questions,

            userId: userid || "anonymous",

            finalized: true,

            coverImage:
                await getCompanyLogo(company),

            createdAt:
                new Date().toISOString(),
        };

        const docRef = await db
            .collection("interviews")
            .add(interview);

        console.log(
            "INTERVIEW CREATED:",
            docRef.id
        );

        return NextResponse.json({

            success: true,

            interviewId: docRef.id,

            data: interview,

        });

    } catch (error) {

        console.log(
            "GENERATE INTERVIEW ERROR:",
            error
        );

        return NextResponse.json({

            success: false,

            message:
                error.message ||
                "Failed to generate interview",

        }, {

            status: 500,

        });
    }
}
