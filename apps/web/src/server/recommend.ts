import { createServerFn } from '@tanstack/react-start';
import { GoogleGenAI } from '@google/genai';
import {
  RecommendationRequestSchema,
  RecommendationResponseSchema,
  type RecommendationRequest,
  type RecommendationResponse,
} from '@weather/shared';
import {
  buildSystemInstruction,
  buildUserPrompt,
  responseSchema,
} from '~/features/recommendation/prompts';

const MODEL_CHAIN = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'] as const;

function isTransient(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b(503|429|500|502|504|UNAVAILABLE|RESOURCE_EXHAUSTED|overload)/i.test(msg);
}

async function generate(
  ai: GoogleGenAI,
  model: string,
  data: RecommendationRequest,
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: buildUserPrompt(data),
    config: {
      systemInstruction: buildSystemInstruction(),
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.6,
    },
  });
  const text = response.text;
  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
}

export const recommend = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => RecommendationRequestSchema.parse(data))
  .handler(async ({ data }): Promise<RecommendationResponse> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set on the server.');
    }

    const ai = new GoogleGenAI({ apiKey });

    let text: string | undefined;
    let lastError: unknown;
    outer: for (const model of MODEL_CHAIN) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          text = await generate(ai, model, data);
          break outer;
        } catch (err) {
          lastError = err;
          if (!isTransient(err)) throw err;
          if (attempt === 0) await new Promise((r) => setTimeout(r, 600));
        }
      }
    }

    if (!text) {
      throw new Error(
        `Gemini is temporarily unavailable. ${
          lastError instanceof Error ? lastError.message : ''
        }`.trim(),
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error('Gemini response was not valid JSON.');
    }

    const results =
      parsed && typeof parsed === 'object' && 'results' in parsed
        ? (parsed as { results: unknown }).results
        : [];

    return RecommendationResponseSchema.parse({
      generatedAt: new Date().toISOString(),
      results,
    });
  });
