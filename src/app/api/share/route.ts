import { NextRequest } from "next/server";
import { sql } from "@vercel/postgres";
import { MAX_PROMPT_LENGTH, MAX_INPUT_LENGTH } from "../generate/route";

// Saves shared links to the database
export async function POST(req: NextRequest) {
  try {
    const { input, prompt, voice } = await req.json();
    const clippedInput = input.slice(0, MAX_INPUT_LENGTH);
    const clippedPrompt = prompt.slice(0, MAX_PROMPT_LENGTH);
    const id = crypto.randomUUID();
    await sql`INSERT INTO shares (id, input, prompt, voice) VALUES (${id}, ${
      clippedInput ?? ""
    }, ${clippedPrompt ?? ""}, ${voice ?? ""});`;
    return Response.json({ id });
  } catch (err) {
    console.error("Error storing share params:", err);
    return new Response("An error ocurred.", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const hash = url.searchParams.get("hash");
    if (!hash) {
      return new Response("Not found", { status: 404 });
    }
    const { rows } = await sql<{
      input: string;
      prompt: string;
      voice: string;
    }>`SELECT input, prompt, voice FROM shares WHERE id = ${hash};`;
    if (rows.length === 0) {
      return new Response("Not found", { status: 404 });
    }
    return Response.json(rows[0]);
  } catch (err) {
    console.error("Error retrieving share params:", err);
    return new Response("An error ocurred.", { status: 500 });
  }
}
