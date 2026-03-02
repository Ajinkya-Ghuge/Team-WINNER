import { NextRequest, NextResponse } from "next/server";

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const OPENAI_API = "https://api.openai.com/v1/responses";

type WikiPage = {
  title: string;
  excerpt: string;
  fullurl?: string;
};

type AskResult = {
  answer: string;
  reasoning: string[];
  sources: WikiPage[];
  provider: "openai" | "fallback";
};

async function fetchWikiEvidence(question: string): Promise<WikiPage[]> {
  const url = new URL(WIKI_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", question);
  url.searchParams.set("gsrlimit", "3");
  url.searchParams.set("prop", "extracts|info");
  url.searchParams.set("inprop", "url");
  url.searchParams.set("exchars", "600");
  url.searchParams.set("exintro", "1");
  url.searchParams.set("explaintext", "1");
  url.searchParams.set("origin", "*");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "WikiAgent/1.0 (Next.js demo)" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Wikipedia request failed with ${res.status}`);
  }

  const data = (await res.json()) as {
    query?: { pages?: Record<string, { title: string; extract?: string; fullurl?: string }> };
  };

  const pages = data.query?.pages ? Object.values(data.query.pages) : [];
  return pages
    .filter((p) => p.extract && p.extract.trim().length > 0)
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      excerpt: p.extract ?? "",
      fullurl: p.fullurl,
    }));
}

function fallbackAnswer(question: string, sources: WikiPage[]): AskResult {
  const top = sources[0];
  if (!top) {
    return {
      answer: `I could not find matching Wikipedia evidence for: "${question}". Try a more specific phrasing.`,
      reasoning: [
        "No relevant Wikipedia extracts were returned for this query.",
        "The question likely needs more specific entities, places, or dates.",
      ],
      sources: [],
      provider: "fallback",
    };
  }

  return {
    answer: `Based on Wikipedia, the best match is "${top.title}". ${top.excerpt.slice(0, 300)}...`,
    reasoning: [
      "Wikipedia pages were ranked by text relevance to your question.",
      `The page "${top.title}" contained the strongest introductory evidence.`,
      "This response is generated without OpenAI because OPENAI_API_KEY is not set.",
    ],
    sources,
    provider: "fallback",
  };
}

async function openAiAnswer(question: string, sources: WikiPage[]): Promise<AskResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallbackAnswer(question, sources);
  }

  const sourceBlock = sources
    .map(
      (s, idx) =>
        `[${idx + 1}] ${s.title}\nURL: ${s.fullurl ?? "N/A"}\nExcerpt: ${s.excerpt}`
    )
    .join("\n\n");

  const prompt = [
    "You are WikiAgent. Answer using ONLY the supplied Wikipedia evidence.",
    "If evidence is insufficient, say so clearly.",
    "Return strict JSON with keys: answer (string), reasoning (string array).",
    "Reasoning should be concise evidence-based steps, not private chain-of-thought.",
    `User question: ${question}`,
    "Evidence:",
    sourceBlock || "No evidence returned.",
  ].join("\n");

  const res = await fetch(OPENAI_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "wiki_agent_response",
          schema: {
            type: "object",
            properties: {
              answer: { type: "string" },
              reasoning: {
                type: "array",
                items: { type: "string" },
                minItems: 1,
              },
            },
            required: ["answer", "reasoning"],
            additionalProperties: false,
          },
        },
      },
    }),
  });

  if (!res.ok) {
    return fallbackAnswer(question, sources);
  }

  const data = (await res.json()) as {
    output_text?: string;
  };

  try {
    const parsed = JSON.parse(data.output_text ?? "{}") as {
      answer?: string;
      reasoning?: string[];
    };
    if (!parsed.answer || !Array.isArray(parsed.reasoning)) {
      return fallbackAnswer(question, sources);
    }
    return {
      answer: parsed.answer,
      reasoning: parsed.reasoning,
      sources,
      provider: "openai",
    };
  } catch {
    return fallbackAnswer(question, sources);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { question?: string };
    const question = body.question?.trim();
    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const sources = await fetchWikiEvidence(question);
    const result = await openAiAnswer(question, sources);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
