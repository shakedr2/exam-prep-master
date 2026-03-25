# Exam Prep

A production-quality exam preparation web app built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Supabase.

## Features
- Practice questions by topic (multiple choice)
- Progress tracking per topic
- AI-powered explanations via Supabase Edge Functions
- Admin panel for question management

## Tech Stack
- **React 18** + **TypeScript** — UI and type safety
- **Vite** — build tool
- **Tailwind CSS** + **shadcn/ui** — design system
- **Supabase** — backend (database, auth, Edge Functions)
- **React Router v6** — client-side routing
- **Vitest** — testing

## Environment Variables
Copy `.env.example` to `.env` and fill in:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=your_admin_email
```

## Local Setup
```sh
git clone https://github.com/shakedr2/exam-prep-master.git
cd exam-prep-master
npm install
npm run dev
```

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest tests |

## Architecture
```
src/
  features/          # Feature-based modules
    auth/            # Authentication
    questions/       # Question components and hooks
    topics/          # Topic components and hooks
    progress/        # Progress tracking
    ai/              # AI explanation client and hook
  shared/
    components/      # Shared UI components (Navbar, Layout)
    lib/             # Utilities, grading logic
    integrations/    # Supabase client and types
  pages/             # Route-level page components
  data/              # Static question data
```

## AI Integration
The app uses a Supabase Edge Function (`ai-explain`) as a proxy to OpenAI. The `src/features/ai/aiClient.ts` module handles requests and falls back to mock responses when the endpoint is unavailable.

## Deployment
Build with `npm run build` and deploy the `dist/` folder to any static hosting (Vercel, Netlify, etc.).

## Deployment (Vercel)

1. Fork or clone this repository
2. Go to https://vercel.com/new and import the repo
3. Set the following environment variables in Vercel dashboard:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_PUBLISHABLE_KEY
   - VITE_ADMIN_EMAIL
4. Deploy - Vercel auto-detects Vite and builds correctly
5. For GitHub Actions CI secrets, add the same env vars under repo Settings > Secrets

## Security

Never commit `.env` to version control. Copy `.env.example` to `.env` and fill in your values.

## Tech Stack

- **[Vite](https://vitejs.dev/)** — fast build tool and dev server
- **[React](https://react.dev/)** — UI library
- **[TypeScript](https://www.typescriptlang.org/)** — type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** — accessible component library built on Radix UI
- **[Supabase](https://supabase.com/)** — backend-as-a-service (database, auth, storage)

<!-- deployed via Vercel -->
