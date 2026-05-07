import { NextResponse }
  from "next/server";

import {
  createFeedback,
} from "@/lib/actions/general.actions";

export async function POST(req) {

  try {

    const {
      interviewId,
      userId,
      transcript,
    } = await req.json();

    const result =
      await createFeedback({
        interviewId,
        userId,
        transcript,
      });

    return NextResponse.json(
      result
    );

  } catch (error) {

    console.log(
      "FEEDBACK ROUTE ERROR:",
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