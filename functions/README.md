Firebase Cloud Function: Pilot Registration Notification

This Cloud Function triggers when a new document is created in the `pilotRegistrations` Firestore collection and stores a notification object in Firestore. The notification includes registration details, consent values, and a reference to the original registration.

Setup & Deploy

1. Install Firebase CLI (if not installed):

```bash
npm install -g firebase-tools
firebase login
```

2. From this project root, change to the `functions` folder and install dependencies:

```bash
cd functions
npm install
```

3. Deploy the function:

```bash
cd ..
firebase deploy --only functions:onPilotRegistrationCreate
```

Notes
- The function writes notification documents to the `pilotRegistrationNotifications` collection.
- If you later want email notifications, the function can be extended to use SendGrid or SMTP.
