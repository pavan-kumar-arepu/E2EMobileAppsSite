// src/components/Tabs/VaniCore/PatientDashboard.js
import React from 'react';
import { MOCK_GESTURE_DATA } from './VaniCoreConfig';

// Returns mock data for the logged-in patient alias.
// TODO: Replace with Firebase Firestore read:
//   const sessions = await getDocs(collection(db, 'patients', patientId, 'gestureSessions'));
const getPatientData = (alias) =>
  MOCK_GESTURE_DATA.find((g) => g.patientAlias === alias) || null;

const TREND_META = {
  improving: { icon: '📈', label: 'Improving', cls: 'badge-green' },
  stable: { icon: '➡️', label: 'Stable', cls: 'badge-blue' },
  declining: { icon: '📉', label: 'Declining', cls: 'badge-red' },
};

// Mock session log — future: live from Firestore
const MOCK_SESSIONS = [
  { date: '2026-05-12', gesture: 'Deliberate single blink', accuracy: '96%', duration: '4 min', notes: 'Strong left-eye blink detected consistently.' },
  { date: '2026-05-11', gesture: 'Deliberate single blink', accuracy: '92%', duration: '5 min', notes: 'Slight tremor in right eye — filtered by stability layer.' },
  { date: '2026-05-10', gesture: 'Eye gaze left / right', accuracy: '88%', duration: '3 min', notes: 'First session with gaze tracking enabled.' },
  { date: '2026-05-09', gesture: 'Deliberate single blink', accuracy: '91%', duration: '6 min', notes: 'Calibration re-run; improved threshold detection.' },
];

const PatientDashboard = ({ auth, myRegistration }) => {
  const { alias = 'Pilot-001' } = auth;
  const gestureData = getPatientData(alias);

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
          {gestureData && (
            <p className="vc-patient-condition">{gestureData.condition}</p>
          )}
          <span className={`vc-badge badge-green`}>Active Pilot</span>
        </div>
      </div>

      {/* Gesture summary */}
      {gestureData ? (
        <>
          <div className="vc-grid-4 vc-mt-20">
            <div className="vc-stat-card">
              <div className="vc-stat-num">{gestureData.sessions}</div>
              <div className="vc-stat-label">Sessions Completed</div>
            </div>
            <div className="vc-stat-card">
              <div className="vc-stat-num">{gestureData.accuracy}</div>
              <div className="vc-stat-label">Detection Accuracy</div>
            </div>
            <div className="vc-stat-card">
              <div className="vc-stat-num">{gestureData.avgResponseMs} ms</div>
              <div className="vc-stat-label">Avg Response Time</div>
            </div>
            <div className="vc-stat-card">
              <div className="vc-stat-num">{gestureData.falsePositiveRate}</div>
              <div className="vc-stat-label">False Positive Rate</div>
            </div>
          </div>

          <div className="vc-patient-gesture-row">
            <div className="vc-card vc-mt-20">
              <h4 className="vc-card-title">Primary Gesture</h4>
              <p className="vc-gesture-highlight">{gestureData.primaryGesture}</p>
              <p className="vc-hint">
                VANI has learned your personal baseline for this gesture and optimised its detection thresholds.
              </p>
            </div>
            <div className="vc-card vc-mt-20">
              <h4 className="vc-card-title">Progress Trend</h4>
              <div className="vc-trend-display">
                <span className="vc-trend-icon">{TREND_META[gestureData.trend]?.icon}</span>
                <span className={`vc-badge ${TREND_META[gestureData.trend]?.cls}`}>
                  {TREND_META[gestureData.trend]?.label}
                </span>
              </div>
              <p className="vc-hint">
                Based on your last {gestureData.sessions} sessions. Keep using VANI regularly for better calibration.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="vc-empty">
          No gesture data recorded yet. Your data will appear here after your first session.
        </div>
      )}

      {/* Session log */}
      <h3 className="vc-sub-heading vc-mt-30">Session Log</h3>
      <p className="vc-firebase-note">
        📡 Live session data will be read from Firebase Firestore:{' '}
        <code>/patients/&#123;id&#125;/gestureSessions</code>
      </p>
      <div className="vc-table-wrap">
        <table className="vc-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Primary Gesture</th>
              <th>Accuracy</th>
              <th>Duration</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SESSIONS.map((s, i) => (
              <tr key={i}>
                <td>{s.date}</td>
                <td>{s.gesture}</td>
                <td><strong>{s.accuracy}</strong></td>
                <td>{s.duration}</td>
                <td className="vc-notes-cell">{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Registration data */}
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
