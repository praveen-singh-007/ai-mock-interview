import { db } from "@/firebase/admin";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { getCompanyLogo } from "@/lib/utils";
// export async function GET(){
//     return NextResponse.json({
//   success: true,
//   data: "NEW DEPLOY ACTIVE"
// });
// }

// // export async function POST(request) {

// //     const {
// //         type,
// //         role,
// //         company,
// //         level,
// //         techstack,
// //         amount,
// //     } = await request.json();

// //     try {

// //         const { text } = await generateText({

// //             model: google("gemini-2.5-flash-lite"),

// //             maxRetries: 0,

// //             prompt: `
// //                 Generate ${amount} interview questions.

// //                 Role: ${role}
// //                 Company: ${company}
// //                 Experience Level: ${level}
// //                 Tech Stack: ${techstack}
// //                 Interview Type: ${type}

// //                 Return ONLY a valid JSON array of strings.
// //                 Do not include markdown.
// //                 Do not include \`\`\`json.
// //                 Do not include explanations.
// //                 `,
// //         });

// //         const cleanedText = text
// //             .replace(/```json/g, "")
// //             .replace(/```/g, "")
// //             .trim();

// //         let parsedQuestions = [];

// //         try {

// //             parsedQuestions = JSON.parse(cleanedText);

// //         } catch (parseError) {

// //             console.log("JSON PARSE ERROR:", parseError);

// //             return NextResponse.json(
// //                 {
// //                     success: false,
// //                     message: "Failed to parse generated questions",
// //                 },
// //                 {
// //                     status: 500,
// //                 }
// //             );
// //         }

// //         const interview = {

// //             role,
// //             type,
// //             company,
// //             level,

// //             techstack: techstack
// //                 .split(",")
// //                 .map((item) => item.trim()),

// //             questions: parsedQuestions,

// //             userId: "anonymous",

// //             finalized: true,

// //             coverImage: await getCompanyLogo(company),

// //             createdAt: new Date().toISOString(),
// //         };

// //         await db
// //             .collection("interviews")
// //             .add(interview);

// //         return NextResponse.json(
// //             {
// //                 success: true,
// //                 data: interview,
// //             },
// //             {
// //                 status: 200,
// //             }
// //         );

// //     } catch (error) {

// //         console.log("GENERATE INTERVIEW ERROR:", error);

// //         return NextResponse.json(
// //             {
// //                 success: false,
// //                 message: error.message,
// //             },
// //             {
// //                 status: 500,
// //             }
// //         );
// //     }
// // }

// export async function POST(request) {

//     try {

//         const {
//             role,
//             type,
//             company,
//             level,
//             techstack,
//             amount,
//         } = await request.json();

//         console.log("BODY RECEIVED:", {
//             role,
//             type,
//             company,
//             level,
//             techstack,
//             amount,
//         });

//         const { text } = await generateText({

//             model: google("gemini-2.5-flash-lite"),

//             maxRetries: 0,

//             prompt: `
// Generate ${amount} interview questions.

// Role: ${role}
// Company: ${company}
// Experience Level: ${level}
// Tech Stack: ${techstack}
// Interview Type: ${type}

// Return ONLY a valid JSON array of strings.

// Example:
// [
//   "Question 1",
//   "Question 2"
// ]

// Do not use markdown.
// Do not use \`\`\`.
// `,
//         });

//         console.log("RAW GEMINI RESPONSE:", text);

//         const cleanedText = text
//             .replace(/```json/g, "")
//             .replace(/```/g, "")
//             .trim();

//         const questions = JSON.parse(cleanedText);

//         await db.collection("interviews").add({

//             role,
//             type,
//             company,
//             level,

//             techstack: techstack
//                 .split(",")
//                 .map((item) => item.trim()),

//             questions,

//             finalized: true,

//             createdAt: new Date().toISOString(),
//         });

//         return NextResponse.json({

//             success: true,

//             data: questions,

//         });

//     } catch (error) {

//         console.log("STEP 3 ERROR:", error);

//         return NextResponse.json({

//             success: false,

//             message: error.message,

//         });
//     }
// }

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

                model: "llama-3.1-8b-instant",

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
            .filter((question) =>
                question.length > 10
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
        });
    }
}
