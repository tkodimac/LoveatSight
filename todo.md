# Love at Sight - Project TODO

## Core Infrastructure
- [x] Database schema (users extended, matches, messages, subscriptions)
- [x] tRPC routers (auth, users, matches, messages, subscriptions)
- [x] App routing structure (all pages registered)
- [x] Dark theme CSS variables and global styles

## Pages
- [x] Splash page (pulsing purple heart, auto-redirect)
- [x] Signup/Login page (email/password auth via Manus OAuth)
- [x] Age Gate page (18+ verification with date input)
- [x] Face Verify page (selfie upload/skip)
- [x] Home lobby (welcome card, nearby matches, subscription section, recent messages)
- [x] Chat page (filtered messages, heart like, mutual like detection)

## Components & Popups
- [x] Paywall popup (Spark/Flame tier cards, Stripe test checkout)
- [x] Reveal popup (pulsing silhouette, confetti, face reveal animation)
- [x] Subscription tier cards (Spark £2/mo, Flame £5/mo)
- [x] Blurred silhouette card with heartbeat animation
- [x] Panic button in chat

## Features
- [x] Anonymous matching (no faces until mutual like + paid reveal)
- [x] Location-based nearby users (geolocation + distance calc)
- [x] Knock system (send interest to nearby users)
- [x] Filtered text chat (block phone/email/social links)
- [x] Mutual like detection → trigger paywall
- [x] Subscription tiers (Spark: £2/mo, Flame: £5/mo)
- [x] Stripe test checkout integration (simulated)
- [x] Face verified flag on user profile
- [x] Reveal mechanic (blur removal after payment)

## UI/UX
- [x] Midnight-purple-to-black gradient background
- [x] Subtle purple glows on cards
- [x] Rounded corners throughout
- [x] Clean sans-serif font (Poppins)
- [x] Heartbeat pulse animation on silhouette cards
- [x] Confetti animation on reveal
- [x] PWA manifest (manifest.json)
- [x] Mobile-responsive design (max-width 430px app-container)

## Testing
- [x] Auth flow tests (18 passing)
- [x] Chat filter tests (8 filter scenarios)
- [x] Subscription tier tests
