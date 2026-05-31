Firebase Cloud Function: Pilot Registration Email

This Cloud Function triggers when a new document is created in the `pilotRegistrations` Firestore collection and sends a notification email (using SendGrid) to the VANI team with submitted details and recorded consents.

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

3. Configure SendGrid API key (recommended):

```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
```

Alternatively, you can set `SENDGRID_API_KEY` as an environment variable on your deployment environment.

4. Deploy the function:

```bash
cd ..
firebase deploy --only functions:onPilotRegistrationCreate
```

Notes
- Replace `noreply@vanicore.app` in `functions/index.js` with a verified sender identity in your SendGrid account.
- If you prefer SMTP or another mail provider, replace `@sendgrid/mail` usage with `nodemailer` and configure SMTP credentials instead.
