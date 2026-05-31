const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Firestore trigger: on create of pilotRegistrations, store a notification object in Firestore.
 * This records the registration payload and consent values for later review.
 */
exports.onPilotRegistrationCreate = functions.firestore
  .document('pilotRegistrations/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data() || {};
    const docId = context.params.docId;
    const submittedAt = (data.submittedAt && data.submittedAt.toDate)
      ? data.submittedAt.toDate().toISOString()
      : (data.submittedAt || new Date().toISOString());

    const notification = {
      registrationId: docId,
      fullName: data.fullName || data.alias || '—',
      email: data.email || '—',
      country: data.country || '—',
      relationshipToParticipant: data.relationshipToParticipant || '—',
      condition: data.condition || '—',
      ageGroup: data.ageGroup || '—',
      availableDevices: data.availableDevices || [],
      pilotGoals: data.pilotGoals || '—',
      additionalNotes: data.additionalNotes || '—',
      consent1: !!data.consent1,
      consent2: !!data.consent2,
      consent3: !!data.consent3,
      pilotStatus: data.pilotStatus || 'pending',
      submittedAt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      payload: data,
    };

    try {
      await admin.firestore().collection('pilotRegistrationNotifications').add(notification);
      console.log('Pilot registration notification stored for', docId);
    } catch (err) {
      console.error('Failed to store pilot registration notification for', docId, err);
      throw err;
    }
  });
