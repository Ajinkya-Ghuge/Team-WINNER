"use client";

import { FormEvent, useState } from "react";

type AskResponse = {
  answer: string;
  reasoning: string[];
  sources: { title: string; excerpt: string; fullurl?: string }[];
  provider: "openai" | "fallback";
  error?: string;
};

export default function Home() {
  const [question, setQuestion] = useState("What caused the fall of the Roman Empire?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const json = (await res.json()) as AskResponse;
      if (!res.ok) {
        setResult(null);
        setError(json.error ?? "Request failed.");
      } else {
        setResult(json);
      }
    } catch {
      setResult(null);
      setError("Network error while contacting WikiAgent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10">
      <section className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-xl backdrop-blur md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60">WikiAgent</p>
        <h1 className="mt-2 text-3xl font-bold text-black md:text-5xl">Wikipedia + AI reasoning assistant</h1>
        <p className="mt-3 max-w-3xl text-sm text-black/75 md:text-base">
          Ask a question. WikiAgent retrieves Wikipedia evidence, then builds a grounded answer with concise
          reasoning steps.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
            className="min-h-32 w-full resize-y rounded-2xl border border-black/20 bg-[#fffdf8] p-4 text-black outline-none ring-0 focus:border-black"
          />
          <button
            type="submit"
            disabled={loading || question.trim().length === 0}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/40"
          >
            {loading ? "Thinking..." : "Ask WikiAgent"}
          </button>
        </form>
      </section>

      {error ? (
        <section className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</section>
      ) : null}

      {result ? (
        <section className="mt-5 grid gap-5 md:grid-cols-12">
          <article className="md:col-span-8 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/50">Answer</p>
            <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-black/90">{result.answer}</p>
            <p className="mt-4 text-xs text-black/55">
              Provider: {result.provider === "openai" ? "OpenAI (gpt-4.1-mini)" : "Fallback summarizer"}
            </p>
          </article>

          <aside className="md:col-span-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/50">Reasoning</p>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-black/85">
              {result.reasoning.map((step, idx) => (
                <li key={`${step}-${idx}`}>{step}</li>
              ))}
            </ol>
          </aside>

          <article className="md:col-span-12 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/50">Wikipedia Sources</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {result.sources.length === 0 ? <p className="text-sm text-black/70">No source pages returned.</p> : null}
              {result.sources.map((source) => (
                <div key={source.title} className="rounded-xl border border-black/10 bg-[#fcfaf6] p-3">
                  <p className="text-sm font-semibold text-black">{source.title}</p>
                  <p className="mt-1 text-xs leading-5 text-black/75">{source.excerpt.slice(0, 260)}...</p>
                  {source.fullurl ? (
                    <a
                      href={source.fullurl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs font-semibold text-blue-700 underline-offset-2 hover:underline"
                    >
                      Open Wikipedia
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}
    </main>
  );
}
