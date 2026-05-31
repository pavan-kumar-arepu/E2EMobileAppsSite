const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

const SENDGRID_KEY = functions.config && functions.config().sendgrid && functions.config().sendgrid.key;
if (!SENDGRID_KEY && !process.env.SENDGRID_API_KEY) {
  console.warn('SendGrid key not configured. Set via `firebase functions:config:set sendgrid.key="YOUR_KEY"`');
}
sgMail.setApiKey(SENDGRID_KEY || process.env.SENDGRID_API_KEY);

/**
 * Firestore trigger: on create of pilotRegistrations, send notification email
 * Stores full payload in email body and includes consent checkbox values.
 */
exports.onPilotRegistrationCreate = functions.firestore
  .document('pilotRegistrations/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data() || {};
    const docId = context.params.docId;

    const submittedAt = (data.submittedAt && data.submittedAt.toDate) ? data.submittedAt.toDate().toISOString() : (data.submittedAt || new Date().toISOString());

    const html = [`<h2>New Vani Pilot Registration</h2>`,
      `<p><strong>Document:</strong> ${docId}</p>`,
      `<p><strong>Full Name:</strong> ${data.fullName || data.alias || '—'}</p>`,
      `<p><strong>Email:</strong> ${data.email || '—'}</p>`,
      `<p><strong>Country:</strong> ${data.country || '—'}</p>`,
      `<p><strong>Relationship:</strong> ${data.relationshipToParticipant || '—'}</p>`,
      `<p><strong>Condition:</strong> ${data.condition || '—'}</p>`,
      `<p><strong>Age Group:</strong> ${data.ageGroup || '—'}</p>`,
      `<p><strong>Available Devices:</strong> ${(data.availableDevices || []).join(', ') || '—'}</p>`,
      `<p><strong>Pilot Goals:</strong> ${data.pilotGoals || '—'}</p>`,
      `<p><strong>Additional Notes:</strong> ${data.additionalNotes || '—'}</p>`,
      `<p><strong>Consents:</strong> Consent1: ${data.consent1 ? 'Yes' : 'No'}, Consent2: ${data.consent2 ? 'Yes' : 'No'}, Consent3: ${data.consent3 ? 'Yes' : 'No'}</p>`,
      `<p><strong>pilotStatus:</strong> ${data.pilotStatus || 'pending'}</p>`,
      `<p><strong>Submitted At:</strong> ${submittedAt}</p>`,
      `<hr/>`,
      `<pre style="white-space:pre-wrap;max-height:320px;overflow:auto;">${JSON.stringify(data, null, 2)}</pre>`
    ].join('\n');

    const msg = {
      to: 'vaaninnovations@gmail.com',
      from: 'noreply@vanicore.app', // Replace with a verified sender in SendGrid
      subject: 'New Vani Pilot Registration',
      html,
    };

    try {
      await sgMail.send(msg);
      console.log('Pilot registration email sent for', docId);
    } catch (err) {
      console.error('Failed to send pilot registration email for', docId, err);
      // Rethrow to let Functions retry if desired
      throw err;
    }
  });
