# TubeMetrics — YouTube Channel Analytics & Growth Platform

AI-powered YouTube channel analysis, content generation, trend discovery, and personalized growth roadmaps.

## Features

- **Channel Analysis** — Analyze any YouTube channel with AI-driven insights on performance, engagement, and content patterns
- **Multi-Channel Support** — Switch between multiple analyzed channels across all pages
- **Content Generator** — Generate video titles, descriptions, and content ideas tailored to your channel's style and audience
- **Trends Discovery** — Surface trending topics and formats relevant to your niche
- **Growth Roadmap** — Personalized day-by-day growth plan based on your channel data
- **Subscription Plans** — Free and Pro tiers with Paystack payment integration

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Lovable Cloud (Supabase) — Auth, Database, Edge Functions
- **AI:** Gemini for channel analysis and content generation
- **Payments:** Paystack

## Getting Started

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## Project Structure

```
src/
├── components/       # Reusable UI components (ChannelSwitcher, Navbar, etc.)
├── contexts/         # Auth context
├── hooks/            # Custom hooks (useChannelData, useSubscription)
├── pages/            # Route pages (Dashboard, Analysis, Generator, Trends, Roadmap)
├── integrations/     # Supabase client & types
supabase/
├── functions/        # Edge functions (analyze-channel, generate-content, paystack-*)
├── migrations/       # Database migrations
```

## License

Private — All rights reserved.
