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

## Bug Fixes
- [x] Fix render-phase navigate() calls causing "Cannot update a component while rendering" error in AgeGate, FaceVerify, Login, Home, Chat, ProfileSetup
- [x] Fix NaN matchId error in Chat page when accessed without a valid matchId param
- [x] Seed mutual match + chat test scenario for owner account
- [x] Add Test Panel page for simulating knocks, likes, and mutual matches
- [x] Add passwordHash column to users table
- [x] Add email/password register + login tRPC procedures
- [x] Update Login page with email/password form
- [x] Seed test accounts: aria@test.com, sam@test.com, jordan@test.com (password: password123)
- [x] Fix Knock button selecting wrong user (always knocks first user in list instead of clicked user)
- [x] Add knock_notifications table (schema + migration)
- [x] Add notification tRPC procedures (get, accept, reject with cooldown, ignore, clear)
- [x] Update knock mutation to create a notification for the receiver
- [x] Build NotificationBar component (persistent until cleared, Accept/Reject/Ignore)
- [x] Add reject double-confirm dialog (prompted twice before final rejection)
- [x] Enforce 6-hour knock cooldown after rejection
- [x] Integrate NotificationBar into Home page with polling
- [x] Add notification badge to Bell icon (shows pending knock count)
- [x] Knock button changes to "Chat" when accepted, "Locked" when rejected
- [x] Fix nested button HTML error on Home page (button inside button)
