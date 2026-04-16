# Build Task: accessibility-dev-helper

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: accessibility-dev-helper
HEADLINE: Screen reader simulation for blind developers
WHAT: None
WHY: None
WHO PAYS: None
NICHE: accessibility-tools
PRICE: $$15/mo

ARCHITECTURE SPEC:
A Next.js web app that simulates screen reader behavior for developers, allowing them to test accessibility without actual screen reader software. Features real-time DOM analysis, keyboard navigation simulation, and ARIA attribute validation with audio feedback.

PLANNED FILES:
- app/page.tsx
- app/simulator/page.tsx
- app/api/analyze/route.ts
- components/ScreenReaderSimulator.tsx
- components/DOMAnalyzer.tsx
- components/AudioFeedback.tsx
- components/KeyboardNavigator.tsx
- components/ARIAValidator.tsx
- components/PricingCard.tsx
- lib/screen-reader-engine.ts
- lib/accessibility-rules.ts
- lib/lemon-squeezy.ts
- hooks/useScreenReader.ts
- types/accessibility.ts

DEPENDENCIES: next, react, typescript, tailwindcss, @lemonsqueezy/lemonsqueezy.js, jsdom, cheerio, web-speech-api, framer-motion, lucide-react, zustand, react-hot-toast

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.


PREVIOUS ATTEMPT FAILED WITH:
Codex exited 1: Reading additional input from stdin...
OpenAI Codex v0.121.0 (research preview)
--------
workdir: /tmp/openclaw-builds/accessibility-dev-helper
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: none
reasoning summaries: none
session id: 019d94e3-fb36-75a2-bf8f-e277d6cb00f6
--------
user
# Build Task: accessibility-dev-helper

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: accessibility-dev-helper
HEADLINE: Screen 
Please fix the above errors and regenerate.