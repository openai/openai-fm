export const getCodeSnippet = (
  language: string,
  { input, prompt, voice }: { input: string; prompt: string; voice: string }
): string => {
  switch (language) {
    case "py":
      return `import asyncio

from openai import AsyncOpenAI
from openai.helpers import LocalAudioPlayer

openai = AsyncOpenAI()

input = ""${JSON.stringify(input)}""

instructions = ""${JSON.stringify(prompt)}""

async def main() -> None:

    async with openai.audio.speech.with_streaming_response.create(
        model="gpt-4o-mini-tts",
        voice="${voice}",
        input=input,
        instructions=instructions,
        response_format="pcm",
    ) as response:
        await LocalAudioPlayer().play(response)

if __name__ == "__main__":
    asyncio.run(main())`;
    case "js":
      return `import OpenAI from 'openai';
import { playAudio } from 'openai/helpers/audio';

const openai = new OpenAI();

const input = ${JSON.stringify(input)};

const instructions = ${JSON.stringify(prompt)};

const response = await openai.audio.speech.create({
  model: 'gpt-4o-mini-tts',
  voice: '${voice}',
  input,
  instructions,
});

await playAudio(response);
`;
    case "curl":
      return `curl https://api.openai.com/v1/audio/speech \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "model": "gpt-4o-mini-tts",
  "voice": "${voice}",
  "input": ${JSON.stringify(input)},
  "instructions": ${JSON.stringify(prompt)},
  "response_format": "wav"
}' | ffplay -i -`;
    default:
      return "";
  }
};
