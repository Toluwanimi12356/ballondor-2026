# Firestore community ballot setup

1. In Firebase Console, open the project that matches `NEXT_PUBLIC_FIREBASE_PROJECT_ID` and create a Cloud Firestore database.
2. Deploy the repository's `firestore.rules` from Firebase Console → Firestore Database → Rules, or with the Firebase CLI using `firebase deploy --only firestore:rules --project <your-project-id>` from this project.
3. Start the Next.js app with the existing public Firebase environment variables configured. No Admin SDK or service-account key is used by the website.

The website writes one document to `votes/{voterId}` with `candidateId`, `voterId`, and a server timestamp. The document ID is the same random UUID stored in `ballondor2026_voter_id`. Rules permit only a first create, reject invalid candidate IDs and extra fields, and prohibit edits/deletes. This makes repeated writes from the same browser ID fail at the database even if the UI is bypassed.

For live percentages the client listens to the `votes` collection once after Firestore confirms that visitor has voted, then groups the small collection by candidate ID. The current rules permit public reads so that listener can calculate the total. Vote documents, including candidate choice and random voter ID, are therefore readable by visitors; this is a community poll, not an authenticated or anonymous-to-the-database election. Clearing or replacing browser storage can still create a new voter identity.

The voter check uses a direct document read by ID, so no composite Firestore index is required. The UI never trusts cached vote state without checking Firestore.
