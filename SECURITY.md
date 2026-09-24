# Security

## Reporting a vulnerability

Please do not post exploitable details or credentials in a public issue. Contact the repository owner privately through the repository host's security advisory/reporting feature (or another private channel already agreed with the owner). Include affected route/component, reproduction steps, impact, and a suggested mitigation. Do not include real voter data or secrets in a report.

## Current Protections

- Firestore rules accept creates only for the eight known candidate IDs, enforce a narrow document schema, require a UUIDv4 voter ID to equal the vote document ID, and reject updates/deletes.
- Client-side candidate validation is backed by those database rules; client validation alone is not a security boundary.
- Firebase is initialized through the client SDK and uses the default Firestore database. The repository does not require an Admin SDK key in the web application.
- Environment files and common service-account/private-key files are excluded from Git. Only public Firebase client configuration belongs in `NEXT_PUBLIC_FIREBASE_*` variables.
- Responses receive baseline browser security headers from `next.config.ts`, including a Content Security Policy. Inline script allowance is currently required by the Next.js App Router setup.

## Voting Model

The browser persists a randomly generated UUID voter ID and submits one ballot document at `votes/{voterId}`. Returning with that same ID can restore the prior ballot. This is convenient anonymous participation, not a verified person/account identity.

## Firestore Rules

The rules allow public reads because the current live-results UI reads and aggregates ballot documents in the browser. Creates are restricted to the exact eight candidate IDs and the `candidateId`, `voterId`, and `createdAt` fields; voter ID must be a UUIDv4 matching the document ID, and the timestamp must match Firestore `request.time`. Updates and deletes are denied. Rules in this repository do not prove what is currently active in Firebase; verify them in the console before relying on them.

## Abuse Prevention

Candidate allow-list checks, Firestore rules, immutable voter documents, and persistent browser IDs reduce malformed writes and casual repeat submissions. App Check is not configured/enforced; enable it after testing in monitoring mode. No server-side IP/device rate limit is present because ballot writes go directly from the browser to Firestore. A stronger future design could use Firebase Anonymous Authentication, or a trusted backend with rate limiting and aggregate-only reads; either change needs a planned migration and abuse/privacy review.

## Known limitations and residual risks

- Ballots are readable by any visitor because the current client computes live results from the votes collection. Each record exposes the selected candidate and a random pseudonymous voter ID. It does not contain a name or account identity, but this is still public behavioral data.
- A browser-generated UUID is not proof of a unique person. Clearing local storage, using another browser/device, or modifying a client can bypass the intended one-ballot-per-browser behavior. Firestore rules prevent reusing the same ID, not acquiring a new one.
- There is no server-side rate limit, bot challenge, or enforced Firebase App Check in the current app. App Check is a recommended additional abuse-control layer, not a substitute for server-side validation or identity controls.
- Realtime totals are aggregated client-side from raw ballot documents. This is simple for a small poll but incurs reads proportional to the collection and is not suitable for unbounded traffic. For scale or private ballot records, move writes and aggregation behind a trusted backend and expose only aggregate totals.
- Local `firestore.rules` are not proof of which rules are currently deployed in Firebase. The project owner must compare/publish and verify the active rules in Firebase Console or with the Firebase CLI.
- The production URL and Firebase project/environment configuration must be checked in their respective consoles; this repository cannot attest to live deployment state.

## Production data

Do not seed fictitious votes or use production ballots for QA. Restrict console access and monitor usage and unexpected vote volume. If results need preserving, arrange a Firestore export to an access-controlled Cloud Storage bucket using the supported managed export workflow and a least-privilege operator account; verify the export can be restored, account for export/storage costs, and never commit exports to Git.
