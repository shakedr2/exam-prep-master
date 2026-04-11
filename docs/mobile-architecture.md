# ExamPrep Mobile Architecture & Cross-Platform Strategy

> Created: April 2026 | Status: Approved Architecture Decision

## Executive Summary

ExamPrep will ship to App Store (iOS) and Galaxy Store / Google Play (Android)
using a **progressive enhancement** strategy: PWA first, then Capacitor native wrapping.
No code rewrite needed — the existing React + Vite app is the single codebase.

## Strategy: 3 Phases

### Phase A: PWA (Progressive Web App) — NOW
- `vite-plugin-pwa` is already installed
- Configure service worker for offline caching
- Add web app manifest (name, icons, theme color, display: standalone)
- Splash screens for iOS and Android
- Installable from browser ("Add to Home Screen")
- Works offline with cached content
- Push notifications via Web Push API

### Phase B: Capacitor Native Wrapping — Phase 16
- Wrap the existing React app with `@capacitor/core`
- Same codebase, same build — packaged as native iOS/Android app
- Access native APIs: biometrics, haptics, native push, camera
- Submit to App Store and Google Play / Galaxy Store
- Estimated effort: 1-2 weeks for initial setup

### Phase C: Native-Only Features — Phase 17+
- Biometric login (Face ID / fingerprint)
- Native push notifications (APNs / FCM)
- Widget support (iOS 16+ / Android)
- Deep linking (exam-prep://topic/variables_io)
- In-app purchases (if monetization requires it)

## Architecture Decisions for Mobile-Readiness

### 1. Component Design
- All touch targets: minimum 44x44px (Apple HIG) / 48x48dp (Material)
- Bottom navigation bar (not sidebar) for mobile
- Safe area insets: `env(safe-area-inset-top)` etc.
- No hover-only interactions — all must work with touch
- Swipe gestures for navigation where appropriate

### 2. Navigation Pattern
```
Mobile: Bottom Tab Bar
- Home (tracks)
- Learn (current module)
- Practice (questions)
- Profile (progress + settings)

Desktop: Side Navigation
- Full sidebar with sections
- Same routes, different layout
```

### 3. Responsive Breakpoints
```css
/* Mobile first */
--bp-sm: 640px;   /* Small phones */
--bp-md: 768px;   /* Tablets */
--bp-lg: 1024px;  /* Desktop */
--bp-xl: 1280px;  /* Wide desktop */
```

### 4. Offline Strategy
- Cache-first for static assets (JS, CSS, images)
- Network-first for API calls with stale-while-revalidate
- Store last 5 lessons in IndexedDB for offline reading
- Queue practice attempts offline, sync when online
- Show clear offline/online indicator

### 5. Performance Budgets
- First Contentful Paint: < 1.5s on 3G
- Time to Interactive: < 3s on 3G
- Bundle size: < 200KB initial JS (code-split routes)
- Lighthouse PWA score: 100
- Lighthouse Performance: > 90

### 6. Capacitor Plugin Plan
```
@capacitor/app          — App lifecycle, back button
@capacitor/haptics      — Tactile feedback on quiz answers
@capacitor/push-notifs  — Native push notifications
@capacitor/preferences  — Native key-value storage
@capacitor/browser      — In-app browser for external links
@capacitor/splash-screen — Native splash screen
@capacitor/status-bar   — Status bar styling
@capacitor/keyboard     — Keyboard events for code editor
```

### 7. App Store Requirements
#### iOS (App Store)
- Xcode project via Capacitor
- App icons: 1024x1024 + all required sizes
- Screenshots: iPhone 6.7", 6.5", 5.5", iPad 12.9"
- Privacy policy URL required
- App Review: ~1-2 weeks first submission
- Annual fee: $99/year Apple Developer

#### Android (Google Play + Galaxy Store)
- Android Studio project via Capacitor
- Feature graphic: 1024x500
- Screenshots: phone + tablet
- Privacy policy URL required
- Google Play fee: $25 one-time
- Galaxy Store: free to publish

### 8. Monetization Consideration
- Web payments (Stripe): 0% platform commission
- In-app purchases: 30% Apple/Google commission
- Recommended: Stripe for web, native IAP only if required by store
- Consider "reader app" exemption for educational content

## File Structure Addition
```
exam-prep-master/
├── capacitor.config.ts     (Phase B)
├── ios/                    (Phase B - auto-generated)
├── android/                (Phase B - auto-generated)
├── public/
│   ├── manifest.json       (Phase A - PWA manifest)
│   ├── sw.js               (Phase A - service worker)
│   └── icons/              (Phase A - PWA icons)
└── src/
    ├── hooks/
    │   ├── use-platform.ts  (detect web/ios/android)
    │   └── use-offline.ts   (offline status)
    ├── layouts/
    │   ├── MobileLayout.tsx  (bottom tabs)
    │   └── DesktopLayout.tsx (sidebar)
    └── components/
        └── ui/
            └── safe-area.tsx (safe area wrapper)
```

## Current State Compatibility
- React 18 + Vite + TypeScript: Capacitor compatible
- Supabase JS client: works in Capacitor WebView
- Framer Motion: works in Capacitor WebView
- Radix UI: works but needs touch-target audit
- TailwindCSS: fully compatible
- i18next: fully compatible
- vite-plugin-pwa: Phase A ready

## Implementation Priority
1. PWA manifest + service worker config (Phase 10.8)
2. Mobile-responsive layouts with bottom nav (Phase 10.8)
3. Touch-target audit on all interactive elements (Phase 10.8)
4. Offline caching strategy (Phase 10.8)
5. Capacitor setup + iOS/Android projects (Phase 16)
6. Native push notifications (Phase 16)
7. App Store submission (Phase 16)
8. Native-only features (Phase 17+)
