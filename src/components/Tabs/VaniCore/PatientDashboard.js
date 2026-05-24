// src/components/Tabs/VaniCore/PatientDashboard.js
import React from 'react';

const PatientDashboard = ({ auth, myRegistration }) => {
  const alias = auth.alias || auth.username || 'User';

  return (
    <section className="vc-section">
      <h2 className="vc-section-title">
        <span className="vc-title-icon">👤</span> My VANI Dashboard
      </h2>
      <p className="vc-section-sub">
        Your gesture tracking data and pilot progress. Data is private to you and your caregiver.
      </p>

      {/* Profile card */}
      <div className="vc-patient-header">
        <div className="vc-patient-avatar">{alias.split('-')[1] || '?'}</div>
        <div>
          <h3 className="vc-patient-alias">{alias}</h3>
          <span className="vc-badge badge-green">Active Pilot</span>
        </div>
      </div>

      {/* Gesture summary — live data once sessions exist */}
      <div className="vc-empty vc-mt-20">
        No gesture data recorded yet. Stats will appear here after your first VANI session.
      </div>

      {/* Session log */}
      <h3 className="vc-sub-heading vc-mt-30">Session Log</h3>
      <p className="vc-firebase-note">
        📡 Live session data from Firestore: <code>/patients/&#123;id&#125;/gestureSessions</code>
      </p>
      <div className="vc-empty">
        No sessions recorded yet. Your session history will appear here automatically.
      </div>

      {/* Pilot registration */}
      {myRegistration && (
        <>
          <h3 className="vc-sub-heading vc-mt-30">My Pilot Registration</h3>
          <div className="vc-card vc-reg-card">
            <div className="vc-reg-row">
              <span className="vc-reg-label">Condition</span>
              <span>{myRegistration.condition}</span>
            </div>
            <div className="vc-reg-row">
              <span className="vc-reg-label">Age Group</span>
              <span>{myRegistration.ageGroup}</span>
            </div>
            <div className="vc-reg-row">
              <span className="vc-reg-label">Willingness</span>
              <span className={`vc-badge ${
                myRegistration.willingness === 'eager' ? 'badge-green'
                : myRegistration.willingness === 'willing' ? 'badge-blue'
                : 'badge-gray'
              }`}>{myRegistration.willingness}</span>
            </div>
            <div className="vc-reg-row">
              <span className="vc-reg-label">Affected Parts</span>
              <span>{(myRegistration.impactedParts || []).join(', ') || '—'}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default PatientDashboard;
