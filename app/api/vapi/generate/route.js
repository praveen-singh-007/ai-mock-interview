import { db } from "@/firebase/admin";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { getCompanyLogo } from "@/lib/utils";
export async function GET(){
    return NextResponse.json({
  success: true,
  data: "NEW DEPLOY ACTIVE"
});
}

// export async function POST(request) {

//     const {
//         type,
//         role,
//         company,
//         level,
//         techstack,
//         amount,
//     } = await request.json();

//     try {

//         const { text } = await generateText({

//             model: google("gemini-2.5-flash-lite"),

//             maxRetries: 0,

//             prompt: `
//                 Generate ${amount} interview questions.

//                 Role: ${role}
//                 Company: ${company}
//                 Experience Level: ${level}
//                 Tech Stack: ${techstack}
//                 Interview Type: ${type}

//                 Return ONLY a valid JSON array of strings.
//                 Do not include markdown.
//                 Do not include \`\`\`json.
//                 Do not include explanations.
//                 `,
//         });

//         const cleanedText = text
//             .replace(/```json/g, "")
//             .replace(/```/g, "")
//             .trim();

//         let parsedQuestions = [];

//         try {

//             parsedQuestions = JSON.parse(cleanedText);

//         } catch (parseError) {

//             console.log("JSON PARSE ERROR:", parseError);

//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Failed to parse generated questions",
//                 },
//                 {
//                     status: 500,
//                 }
//             );
//         }

//         const interview = {

//             role,
//             type,
//             company,
//             level,

//             techstack: techstack
//                 .split(",")
//                 .map((item) => item.trim()),

//             questions: parsedQuestions,

//             userId: "anonymous",

//             finalized: true,

//             coverImage: await getCompanyLogo(company),

//             createdAt: new Date().toISOString(),
//         };

//         await db
//             .collection("interviews")
//             .add(interview);

//         return NextResponse.json(
//             {
//                 success: true,
//                 data: interview,
//             },
//             {
//                 status: 200,
//             }
//         );

//     } catch (error) {

//         console.log("GENERATE INTERVIEW ERROR:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: error.message,
//             },
//             {
//                 status: 500,
//             }
//         );
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
        } = await request.json();

        console.log("BODY RECEIVED:", {
            role,
            type,
            company,
            level,
            techstack,
            amount,
        });

        await db.collection("interviews").add({

            role,
            type,
            company,
            level,

            techstack: techstack
                .split(",")
                .map((item) => item.trim()),

            amount: Number(amount),

            createdAt: new Date().toISOString(),

            test: true,
        });

        return NextResponse.json({
            success: true,
            data: "Firestore document created successfully",
        });

    } catch (error) {

        console.log("FIRESTORE TEST ERROR:", error);

        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}