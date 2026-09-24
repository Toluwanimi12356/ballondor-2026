# Production Security Checklist

Owner-operated checks before and during production:

- [ ] Confirm the Vercel production domain and deployment target; verify direct player routes and the rendered security headers on the live response.
- [ ] Set all six `NEXT_PUBLIC_FIREBASE_*` values in Vercel Project Settings for the intended environments. Confirm Firebase `projectId` matches the intended production project without copying values into issues or logs.
- [ ] Compare `firestore.rules` with the rules active in Firebase Console, deploy the reviewed rules, and verify unauthenticated create/read/update/delete behavior using the Firebase Emulator or a dedicated non-production project. Never seed production ballots for QA.
- [ ] Confirm Firestore uses the intended default database and monitor reads/writes and quota alerts.
- [ ] Enable Firebase App Check for the web app with an appropriate supported provider, validate it in monitoring mode first, then enforce it for Firestore after confirming legitimate traffic. Update CSP only for the exact provider endpoints required by the chosen integration.
- [ ] Enable multi-factor authentication for Google/Firebase, Vercel, and source-host owner accounts; remove stale team members and credentials.
- [ ] Turn on repository secret scanning and dependency/security alerts where available; review alerts and update dependencies through tested changes.
- [ ] Review vote-volume anomalies and Firebase billing/usage alerts regularly. Current browser IDs are pseudonymous and are not resistant to a determined repeat voter or automated abuse.
- [ ] Decide whether raw vote records should remain publicly readable. For privacy or growth, migrate to a trusted server-side write/aggregation design that exposes only aggregate totals; do not add client-writable counters.
- [ ] Establish a documented retention, export, and recovery policy for Firestore data. Keep any exports access-controlled and out of Git.
- [ ] Keep `.env.local`, service-account credentials, private keys, and temporary source videos out of commits. If a credential is ever committed, revoke/rotate it; deleting it in a later commit is insufficient.
- [ ] Verify production logs do not contain secrets or unnecessary voter data and ensure security headers/CSP remain compatible after deploy.
