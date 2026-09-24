# Ballon d'Or 2026

A premium interactive community voting experience for the 2026 Ballon d'Or, where football fans can review candidate stats, videos, trophies, achievements, compare players, and cast a live community ballot.

## Live Demo

https://ballondor-2026.vercel.app

## Features

- Eight Ballon d'Or candidate profiles with season evidence.
- Official nominee headline Matches, Goals, and Assists, with goal contributions calculated from goals and assists.
- Player videos with muted playback, inline support, and an optional sound control.
- Verified team trophies, individual honours, and source links.
- Side-by-side comparison for two or three candidates.
- Anonymous community voting with persistent browser voter IDs and Firestore-backed duplicate-vote prevention.
- Realtime community results, unlocked after a ballot is confirmed.
- Responsive layouts, sticky navigation, an active-section indicator, and a keyboard-operable mobile menu.
- Reduced-motion support, visible focus states, and a custom Ballon d'Or community brand mark and favicon.
- Cinematic page and video transitions.

## Candidates

- Harry Kane
- Rodri
- Kylian Mbappé
- Lamine Yamal
- Lionel Messi
- Ousmane Dembélé
- Khvicha Kvaratskhelia
- Michael Olise

## Tech Stack

- Next.js 15 and React 19
- TypeScript
- CSS (project stylesheets; no utility CSS framework)
- Firebase client SDK and Cloud Firestore
- Lucide React icons
- Vercel deployment target
- FFmpeg for preparing optimized player video clips (media workflow, not an application runtime dependency)

## Data Sources

Headline candidate statistics are sourced from the official Ballon d'Or nominee material used by the project. Trophies and individual honours are presented with verification status and source references. See [DATA_SOURCES.md](DATA_SOURCES.md) for the player-by-player evidence and [VIDEO_ASSETS.md](VIDEO_ASSETS.md) for video processing details.

This project is independent and is not affiliated with France Football or the official awards.

## Voting

Visitors do not need an account. The browser creates and persistently stores an anonymous voter ID; Firestore is the source of truth for whether that ID has voted. A repeat ballot using the same ID is rejected by the voting flow and database rules. This is community-poll abuse prevention, not cryptographically secure one-person-one-vote identity verification: clearing browser storage or using another browser can create a different ID. Community results become available after Firestore confirms the ballot.

## Firebase Setup

Follow [FIRESTORE_SETUP.md](FIRESTORE_SETUP.md) to configure Firestore and its security rules. The website uses Firebase's public client configuration; it does not require an Admin SDK service-account key. Required variable names are listed in [.env.example](.env.example).

## Deployment

The production frontend is deployed on Vercel at [ballondor-2026.vercel.app](https://ballondor-2026.vercel.app). Configure these variables in Vercel Project Settings for each required environment: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, and `NEXT_PUBLIC_FIREBASE_APP_ID`. Firebase client configuration is public by design; Firestore security rules, not secrecy of these values, must protect data. Never add Admin SDK credentials to the frontend or commit local environment files. A successful local build does not verify the deployed Vercel environment or the active Firebase rules.

## Security

See [SECURITY.md](SECURITY.md) for the current threat model and [PRODUCTION_SECURITY_CHECKLIST.md](PRODUCTION_SECURITY_CHECKLIST.md) for deployment-owner actions. The shipped Firestore rules restrict ballot creation to the eight candidate IDs, require a UUIDv4 voter ID matching the document ID, and deny edits and deletes. The client currently reads raw ballots to calculate live totals, so candidate choice and pseudonymous voter ID are publicly readable. Browser-generated IDs are not identity verification and do not prevent votes from a cleared browser or a second device. This implementation has no server-side rate limit or App Check enforcement.

## Local Development

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Available project checks are `npm run typecheck`, `npm run lint`, and `npm run build`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required public Firebase configuration for your project. Do not commit `.env.local`, private credentials, or service-account files.

## Production Build

```bash
npm run build
npm start
```

## Project Structure

- `app/` — Next.js pages, player routes, and global styles.
- `components/` — shared brand and player-video components.
- `data/` — candidate records and verified headline statistics.
- `lib/` — Firebase voting, anonymous voter IDs, and football data utilities.
- `public/` — player imagery, optimized video clips, brand assets, and other static media.
- `types/` — shared TypeScript data contracts.

## Media

The public site uses optimized player video clips rather than the original source presentation. Poster images provide a lightweight visual before playback. Videos play muted where browser policy permits, and users can enable sound with the accessible player control.

## Accessibility

Navigation and voting controls use native links and buttons and are keyboard operable. The interface includes visible focus states, a responsive navigation menu with Escape-to-close behavior, reduced-motion preferences, and an accessible video sound control.

## Disclaimer

This is an independent community voting project and is not affiliated with France Football, L'Équipe, FIFA, UEFA, or the official Ballon d'Or awards.

Statistics and achievements are presented for informational purposes and are sourced from the references documented in the project.
