# ExamPrep — Tools & Plugins Evaluation

> Date: April 2026 | Stack: React 18 + Vite + Tailwind + Shadcn/UI + Framer Motion + Supabase + Vercel

## Current Stack Summary
- Frontend: React 18, Vite, TypeScript, TailwindCSS, Shadcn/UI, Radix UI, Framer Motion
- Backend: Supabase (PostgreSQL + Auth + Edge Functions + Realtime)
- AI: OpenAI + Anthropic APIs via Supabase Edge Functions
- Deploy: Vercel (frontend), Supabase (backend)
- Monitoring: PostHog (analytics), Sentry (errors)
- i18n: i18next + react-i18next
- Design: Custom design tokens, RTL Hebrew, dark theme

---

## Tool Evaluations

### 1. tRPC
| Criteria | Answer |
|----------|--------|
| Compatible? | No — requires Node.js backend. We use Supabase Edge Functions (Deno) |
| Problem it solves | Type-safe API layer between frontend and backend |
| Integration effort | High — would need to add Express/Node backend |
| Risk | Adds unnecessary complexity; Supabase client already provides typed queries |
| **Verdict** | **Skip** — Supabase JS client gives us typed queries already |

### 2. Clerk (Auth)
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes — React SDK available |
| Problem it solves | Managed auth with UI components, MFA, org management |
| Integration effort | High — would need to replace entire Supabase Auth |
| Risk | Vendor lock-in, monthly cost, duplicates what Supabase Auth already does |
| **Verdict** | **Skip** — Supabase Auth works, Google OAuth is done, no reason to switch |

### 3. Uploadthing / S3
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes |
| Problem it solves | File uploads (profile pictures, course materials) |
| Integration effort | Low (Uploadthing) / Medium (S3 direct) |
| Risk | Uploadthing has usage limits on free tier |
| **Verdict** | **Maybe** — not needed now, but useful when adding course material uploads. Supabase Storage is the simpler option for our stack |

### 4. Stripe
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes |
| Problem it solves | Payment processing for premium subscriptions |
| Integration effort | Medium — needs webhook handler in Edge Function |
| Risk | Standard, well-documented. Israel support is good |
| **Verdict** | **Worth it (Phase 9)** — essential for monetization. Integrate via Supabase Edge Functions |

### 5. Resend + React Email
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes — already partially integrated |
| Problem it solves | Transactional emails (welcome, weekly progress, reminders) |
| Integration effort | Low — Resend already set up in Edge Functions |
| Risk | Minimal |
| **Verdict** | **Worth it** — already in use. Expand with React Email templates |

### 6. Capacitor (Mobile)
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes — wraps existing React/Vite app |
| Problem it solves | Ship to App Store + Galaxy Store without rewriting |
| Integration effort | Medium — 1-2 weeks for initial setup |
| Risk | WebView performance on older devices; need to test animations |
| **Verdict** | **Worth it (Phase 16)** — already planned in ROADMAP and mobile-architecture.md |

### 7. PWA (vite-plugin-pwa)
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes — plugin already installed |
| Problem it solves | Offline access, installable on home screen, push notifications |
| Integration effort | Low — just needs configuration |
| Risk | iOS PWA support is limited (no push until iOS 16.4+) |
| **Verdict** | **Worth it (Phase 10.8)** — quick win, already have the plugin |

### 8. Monaco Editor
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes — @monaco-editor/react works with Vite |
| Problem it solves | In-browser Python code editor for lessons |
| Integration effort | Medium — need to configure Python syntax, run integration |
| Risk | Large bundle size (~2MB); needs code splitting |
| **Verdict** | **Worth it (Phase 10.6)** — essential for interactive Python learning |

### 9. React Three Fiber (Three.js)
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes |
| Problem it solves | 3D Learning Path Map visualization |
| Integration effort | High — complex 3D scene, camera, interactions |
| Risk | Performance on mobile, large bundle, steep learning curve |
| **Verdict** | **Maybe (Phase 14)** — cool but not essential. Consider 2D alternative first |

### 10. Turborepo / NX (Monorepo)
| Criteria | Answer |
|----------|--------|
| Compatible? | Partial — would need to restructure project |
| Problem it solves | Shared code between web/mobile/edge functions |
| Integration effort | High — full project restructure |
| Risk | Overhead for single-developer project |
| **Verdict** | **Skip** — unnecessary complexity for current team size |

### 11. Zustand (State Management)
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes |
| Problem it solves | Global state management (user, progress, settings) |
| Integration effort | Low — drop-in, no boilerplate |
| Risk | Minimal — tiny bundle, simple API |
| **Verdict** | **Worth it** — better than prop drilling for user/progress state. Consider when state grows |

### 12. React Query (TanStack Query)
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes — already installed (@tanstack/react-query) |
| Problem it solves | Server state caching, background refetch, optimistic updates |
| Integration effort | Already done |
| Risk | None — already in use |
| **Verdict** | **Already using** — expand usage for all Supabase queries |

### 13. Zod
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes — already installed |
| Problem it solves | Runtime validation for forms, API responses, env vars |
| Integration effort | Already done |
| Risk | None |
| **Verdict** | **Already using** — expand to validate all API responses |

### 14. Hono (Edge-first web framework)
| Criteria | Answer |
|----------|--------|
| Compatible? | Partial — could replace Edge Functions |
| Problem it solves | Typed routes, middleware, OpenAPI generation |
| Integration effort | High — would need to restructure backend |
| Risk | Supabase Edge Functions already work well |
| **Verdict** | **Skip** — no compelling reason to add another backend layer |

### 15. LemonSqueezy (Payments)
| Criteria | Answer |
|----------|--------|
| Compatible? | Yes |
| Problem it solves | Simpler alternative to Stripe, handles VAT/tax |
| Integration effort | Medium |
| Risk | Less ecosystem than Stripe, fewer payment methods |
| **Verdict** | **Maybe** — simpler than Stripe but less flexible. Evaluate when monetization phase starts |

---

## Summary Table

| Tool | Verdict | When |
|------|---------|------|
| tRPC | Skip | - |
| Clerk | Skip | - |
| Uploadthing/S3 | Maybe | When file uploads needed |
| Stripe | Worth it | Phase 9 (Monetization) |
| Resend + React Email | Worth it | Now (expand existing) |
| Capacitor | Worth it | Phase 16 (Mobile) |
| PWA (vite-plugin-pwa) | Worth it | Phase 10.8 |
| Monaco Editor | Worth it | Phase 10.6 |
| React Three Fiber | Maybe | Phase 14 |
| Turborepo/NX | Skip | - |
| Zustand | Worth it | When state grows |
| React Query | Already using | Expand usage |
| Zod | Already using | Expand usage |
| Hono | Skip | - |
| LemonSqueezy | Maybe | Phase 9 alternative |

## Key Takeaways
1. **Don't add tools you don't need yet** — the current stack is solid
2. **Supabase covers most backend needs** — no need for tRPC, Clerk, or Hono
3. **PWA + Capacitor** is the right mobile strategy (already planned)
4. **Stripe** is the obvious monetization choice
5. **Monaco Editor** is essential for the learning experience
6. **Zustand** is worth adding when global state becomes complex
