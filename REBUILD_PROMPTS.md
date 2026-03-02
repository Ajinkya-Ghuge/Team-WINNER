# WikiAgent Rebuild Prompts

Use these prompts in order to recreate the complete project from scratch.

## Prompt 1: Scaffold

```text
Create a new Next.js 16 project named "wikiagent" with TypeScript and App Router.
Use npm and include ESLint.
```

## Prompt 2: Product Goal

```text
Build a web app called WikiAgent.
Requirements:
- User types a question in the UI.
- Backend fetches top 3 relevant Wikipedia pages/extracts.
- Backend calls OpenAI to generate a grounded answer and concise reasoning steps.
- Response should include answer, reasoning array, and sources list.
- If OPENAI_API_KEY is missing, return fallback answer using Wikipedia extracts.
Tech stack: Next.js App Router + TypeScript.
```

## Prompt 3: API Contract

```text
Implement POST /api/ask that accepts:
{ "question": "string" }

Response:
{
  "answer": "string",
  "reasoning": ["step 1", "step 2"],
  "sources": [{ "title": "string", "excerpt": "string", "fullurl": "string | undefined" }],
  "provider": "openai" | "fallback"
}

Validation:
- Return 400 for empty question.
- Return 500 for unexpected runtime failures.
```

## Prompt 4: Wikipedia Retrieval

```text
Use Wikipedia API endpoint https://en.wikipedia.org/w/api.php with:
- action=query
- format=json
- generator=search
- gsrsearch=<question>
- gsrlimit=3
- prop=extracts|info
- inprop=url
- exchars=600
- exintro=1
- explaintext=1
- origin=*

Map results into source cards with title, excerpt, and fullurl.
```

## Prompt 5: OpenAI Integration

```text
If OPENAI_API_KEY is set, call OpenAI Responses API with model gpt-4.1-mini.
Send question + Wikipedia evidence.
Force strict JSON schema output:
{
  "answer": "string",
  "reasoning": ["string"]
}

Rule: reasoning should be concise evidence-based summary steps, not private chain-of-thought.
```

## Prompt 6: Frontend UI

```text
Create src/app/page.tsx as a client component:
- textarea for question input
- submit button "Ask WikiAgent"
- loading state
- error state
- answer section
- ordered list of reasoning steps
- source cards with "Open Wikipedia" link

Use responsive layout and clean card design with Tailwind CSS.
```

## Prompt 7: Docs

```text
Update README.md with:
- what WikiAgent does
- run instructions
- environment variables
- build instructions
- file structure overview
```

## Prompt 8: Verification

```text
Run:
npm install
npm run build

Confirm app compiles successfully.
```
