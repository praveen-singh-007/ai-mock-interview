import { NextResponse } from "next/server";

export async function POST(req) {
  try {

    const {
      text,
      model = "aura-asteria-en",
    } = await req.json();

    const response = await fetch(
      `https://api.deepgram.com/v1/speak?model=${model}`,
      {
        method: "POST",

        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          text,
        }),
      }
    );

    const audioBuffer =
      await response.arrayBuffer();

    return new Response(
      audioBuffer,

      {
        headers: {
          "Content-Type":
            "audio/mpeg",
        },
      }
    );

  } catch (error) {

    console.log(
      "TTS ERROR:",
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