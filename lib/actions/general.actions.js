
'use server'


import OpenAI from "openai";

const client = new OpenAI({
  apiKey:
    process.env.GROQ_API_KEY,

  baseURL:
    "https://api.groq.com/openai/v1",
});
import { db } from "@/firebase/admin";
export async function getInterviewByUserId(userId) {

    const interviews = await db
        .collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function getLatestInterviews(params) {

    const {
        userId,
        limit = 20,
    } = params;

    const interviews = await db
        .collection('interviews')
        .where('finalized', '==', true)
        .where('userId', '!=', userId)
        .orderBy('userId')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function getInterviewById(id) {

    const interview = await db.collection('interviews').doc(id).get()
        

    return interview.data();
}



export async function createFeedback(
  params
) {

  const {
    interviewId,
    userId,
    transcript,
    feedbackId,
  } = params;

  try {

    const formattedTranscript =
      transcript
        .map(
          (message) =>
            `${message.role}: ${message.content}`
        )
        .join("\n");

    const completion =
      await client.chat.completions.create({

        model:
          "llama-3.3-70b-versatile",

        response_format: {
          type:
            "json_object",
        },

        messages: [
          {
            role: "system",

            content: `
You are an expert technical interviewer.

Analyze the interview transcript and generate professional interview feedback.

Evaluate the candidate in these categories:

- Communication Skills
- Technical Knowledge
- Problem Solving
- Confidence & Clarity
- Role Fit

Rules:
- Be realistic and critical
- Do not be overly lenient
- Give actionable feedback
- Scores should be between 0 and 100

Return STRICT JSON ONLY:

{
  "totalScore": 85,

  "categoryScores": {
    "communication": 80,
    "technicalKnowledge": 88,
    "problemSolving": 84,
    "confidence": 82,
    "roleFit": 90
  },

  "strengths": [
    "Strong understanding of React concepts"
  ],

  "areasForImprovement": [
    "Could explain scalability tradeoffs better"
  ],

  "finalAssessment":
    "Strong candidate overall with good technical depth."
}
`,
          },

          {
            role: "user",

            content: `
Interview Transcript:

${formattedTranscript}
`,
          },
        ],

        temperature: 0.4,

        max_tokens: 700,
      });

    const parsed =
      JSON.parse(
        completion.choices[0]
          .message.content
      );

    const feedback = {

      interviewId,

      userId,

      totalScore:
        parsed.totalScore,

      categoryScores:
        parsed.categoryScores,

      strengths:
        parsed.strengths,

      areasForImprovement:
        parsed.areasForImprovement,

      finalAssessment:
        parsed.finalAssessment,

      createdAt:
        new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {

      feedbackRef = db
        .collection("feedback")
        .doc(feedbackId);

    } else {

      feedbackRef = db
        .collection("feedback")
        .doc();
    }

    await feedbackRef.set(
      feedback
    );

    return {

      success: true,

      feedbackId:
        feedbackRef.id,

      feedback,
    };

  } catch (error) {

    console.log(
      "CREATE FEEDBACK ERROR:",
      error
    );

    return {
      success: false,
    };
  }
}

export async function getFeedbackByInterviewId(
  params
) {

  const {
    interviewId,
    userId,
  } = params;

  try {

    const querySnapshot =
      await db
        .collection("feedback")

        .where(
          "interviewId",
          "==",
          interviewId
        )

        .where(
          "userId",
          "==",
          userId
        )

        .limit(1)

        .get();

    if (
      querySnapshot.empty
    ) {
      return null;
    }

    const feedbackDoc =
      querySnapshot.docs[0];

    return {

      id: feedbackDoc.id,

      ...feedbackDoc.data(),
    };

  } catch (error) {

    console.log(
      "GET FEEDBACK ERROR:",
      error
    );

    return null;
  }
}