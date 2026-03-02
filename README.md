# WikiAgent

<<<<<<< HEAD
WikiAgent is a Next.js + TypeScript app that answers user questions with Wikipedia-grounded evidence and AI-generated reasoning summaries.

## Features

- Question input UI with live response rendering
- Server API route that:
  - fetches top Wikipedia evidence pages
  - calls OpenAI (`gpt-4.1-mini`) for grounded answer + reasoning summary
  - falls back to non-AI summarization when `OPENAI_API_KEY` is missing
- Source cards with links back to Wikipedia

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

If the key is not set, WikiAgent still works using fallback summarization.

## Build

```bash
npm run build
npm start
```

## Project Structure

- `src/app/page.tsx`: WikiAgent frontend UI
- `src/app/api/ask/route.ts`: Wikipedia retrieval + OpenAI orchestration
- `src/app/globals.css`: visual theme and layout background
- `REBUILD_PROMPTS.md`: full prompts to regenerate this project from scratch
=======
AI-Powered Wikipedia Assistant built with Next.js, Genkit AI, and the Wikipedia API.

## Features

- **Question Input**: Ask any question in a simple chat interface
- **AI Agent Answering**: Genkit AI generates factual answers based on Wikipedia content
- **Source Linking**: See the Wikipedia articles used to generate each answer
- **Chat Interface**: Scroll through your conversation history

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui
- **AI Backend**: Genkit AI with Google Gemini
- **Data Source**: Wikipedia API
>>>>>>> 65271435e9993ff644cbb120a2fa7bf1e6e906af
