import { NextRequest, userAgent } from "next/server";

export const MAX_INPUT_LENGTH = 1000;
export const MAX_PROMPT_LENGTH = 1000;

// GET handler that proxies requests to the OpenAI TTS API and streams
// the response back to the client.
import { VOICES } from "@/lib/library";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const ua = userAgent(req);
  const response_format = ua.engine?.name === "Blink" ? "wav" : "mp3";

  // Get parameters from the query string
  let input = searchParams.get("input") || "";
  let prompt = searchParams.get("prompt") || "";
  const voice = searchParams.get("voice") || "";
  const vibe = searchParams.get("vibe") || "audio";

  // Truncate input and prompt to max 1000 characters
  // Frontend handles this, but we'll do it here too
  // to avoid extra requests to the server
  input = input.slice(0, MAX_INPUT_LENGTH);
  prompt = prompt.slice(0, MAX_PROMPT_LENGTH);

  if (!VOICES.includes(voice)) {
    return new Response("Invalid voice", { status: 400 });
  }

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        input,
        response_format,
        voice,
        // Don't pass if empty
        ...(prompt && { instructions: prompt }),
      }),
    });
    if (!apiResponse.ok) {
      return new Response(`An error occurred while generating the audio.`, {
        status: apiResponse.status,
      });
    }

    const filename = `openai-fm-${voice}-${vibe}.${response_format}`;

    // Stream response back to client.
    return new Response(apiResponse.body, {
      headers: {
        "Content-Type": response_format === "wav" ? "audio/wav" : "audio/mpeg",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Error generating speech:", err);
    return new Response("Error generating speech", {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  const ua = userAgent(req);
  const response_format = ua.engine?.name === "Blink" ? "wav" : "mp3";

  const formData = await req.formData();
  let input = formData.get("input")?.toString() || "";
  let prompt = formData.get("prompt")?.toString() || "";
  const voice = formData.get("voice")?.toString() || "";
  const vibe = formData.get("vibe") || "audio";

  // Truncate input and prompt to max 1000 characters
  // Frontend handles this, but we'll do it here too
  // to avoid extra requests to the server
  input = input.slice(0, MAX_INPUT_LENGTH);
  prompt = prompt.slice(0, MAX_PROMPT_LENGTH);

  if (!VOICES.includes(voice)) {
    return new Response("Invalid voice", { status: 400 });
  }

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        input,
        response_format,
        voice,
        // Don't pass if empty
        ...(prompt && { instructions: prompt }),
      }),
    });
    if (!apiResponse.ok) {
      return new Response(`An error occurred while generating the audio.`, {
        status: apiResponse.status,
      });
    }

    const filename = `openai-fm-${voice}-${vibe}.${response_format}`;

    // Stream response back to client.
    return new Response(apiResponse.body, {
      headers: {
        "Content-Type": response_format === "wav" ? "audio/wav" : "audio/mpeg",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Error generating speech:", err);
    return new Response("Error generating speech", {
      status: 500,
    });
  }
}
