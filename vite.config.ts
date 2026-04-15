import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// Derive the Supabase hostname from the build-time env variable so the
// runtime cache URL patterns match the configured project URL. Falls back
// to the generic "supabase.co" glob when the variable is absent (e.g. CI).
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const supabaseHostEscaped = rawSupabaseUrl
  ? new URL(rawSupabaseUrl).hostname.replace(/\./g, "\\.")
  : "supabase\\.co";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      workbox: {
        // Precache all static assets so the app shell works offline
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        // SPA fallback: serve cached index.html for any navigation when offline
        navigateFallback: "/index.html",
        // Do not apply SPA fallback to API/function routes
        navigateFallbackDenylist: [
          /^\/rest\//,
          /^\/functions\//,
          /^\/auth\//,
          /^\/storage\//,
        ],
        runtimeCaching: [
          // ── Cache-first: static assets (images, fonts, icons) ──────────────
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ── Network-first: AI tutor edge function ───────────────────────────
          {
            urlPattern: /\/functions\/v1\/ai-tutor/,
            handler: "NetworkFirst",
            options: {
              cacheName: "ai-responses",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ── Network-first: user progress & profile data ─────────────────────
          {
            urlPattern: new RegExp(
              `${supabaseHostEscaped}/rest/v1/(profiles|user_progress|exam_attempts|topic_progress)`
            ),
            handler: "NetworkFirst",
            options: {
              cacheName: "user-progress",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ── Stale-while-revalidate: question bank ───────────────────────────
          {
            urlPattern: new RegExp(`${supabaseHostEscaped}/rest/v1/questions`),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "questions-bank",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ── Stale-while-revalidate: topics metadata ─────────────────────────
          {
            urlPattern: new RegExp(`${supabaseHostEscaped}/rest/v1/topics`),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "topics-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
