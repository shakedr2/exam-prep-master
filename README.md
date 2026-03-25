# Exam Prep Master

A web application for exam preparation, allowing students to practice questions by topic with progress tracking powered by Supabase.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- A package manager: [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/)
- A [Supabase](https://supabase.com/) project with the following environment variables set:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

Copy `.env.example` (or create a `.env` file in the project root) and fill in the values above.

## Installation

```sh
# 1. Clone the repository
git clone https://github.com/shakedr2/exam-prep-master.git

# 2. Navigate to the project directory
cd exam-prep-master

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

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
