// src/components/Tabs/VaniCore/AdminDashboard.js
import React, { useState } from 'react';
import { BUILDS, MOCK_GESTURE_DATA } from './VaniCoreConfig';

const exportCSV = (filename, rows) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const SECTIONS = ['Overview', 'Pilots', 'Gestures', 'Feedback'];

const TREND_BADGE = {
  improving: { label: '↑ Improving', cls: 'badge-green' },
  stable: { label: '→ Stable', cls: 'badge-blue' },
  declining: { label: '↓ Declining', cls: 'badge-red' },
};

const AdminDashboard = ({ pilots, feedback, downloads, onApproveFeedback, onDismissFeedback }) => {
  const [section, setSection] = useState('Overview');

  const totalDownloads =
    BUILDS.reduce((sum, b) => sum + b.baseDownloads, 0) +
    BUILDS.reduce((sum, b) => sum + (downloads[b.id] || 0), 0);

  const approvedFeedback = feedback.filter((f) => f.approved);
  const pendingFeedback = feedback.filter((f) => !f.approved);

  return (
    <section className="vc-section vc-admin">
      <div className="vc-admin-header">
        <h2 className="vc-section-title">
          <span className="vc-title-icon">⚙️</span> Admin Dashboard
        </h2>
        <p className="vc-section-sub">Full visibility across all pilot data.</p>
      </div>

      {/* Section nav */}
      <div className="vc-admin-nav">
        {SECTIONS.map((s) => (
          <button
            key={s}
            className={`vc-admin-nav-btn ${section === s ? 'active' : ''}`}
            onClick={() => setSection(s)}
          >
            {s}
            {s === 'Feedback' && pendingFeedback.length > 0 && (
              <span className="vc-badge-dot">{pendingFeedback.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {section === 'Overview' && (
        <div className="vc-grid-3">
          <div className="vc-stat-card">
            <div className="vc-stat-num">{pilots.length}</div>
            <div className="vc-stat-label">Pilot Registrations</div>
          </div>
          <div className="vc-stat-card">
            <div className="vc-stat-num">{totalDownloads}</div>
            <div className="vc-stat-label">Total Downloads</div>
          </div>
          <div className="vc-stat-card">
            <div className="vc-stat-num">{MOCK_GESTURE_DATA.length}</div>
            <div className="vc-stat-label">Active Gesture Patients</div>
          </div>
          <div className="vc-stat-card">
            <div className="vc-stat-num">
              {MOCK_GESTURE_DATA.filter((g) => g.trend === 'improving').length}
            </div>
            <div className="vc-stat-label">Improving Trends</div>
          </div>
          <div className="vc-stat-card">
            <div className="vc-stat-num">{approvedFeedback.length}</div>
            <div className="vc-stat-label">Published Feedback</div>
          </div>
          <div className="vc-stat-card vc-stat-pending">
            <div className="vc-stat-num">{pendingFeedback.length}</div>
            <div className="vc-stat-label">Feedback Pending Review</div>
          </div>
        </div>
      )}

      {/* All Pilots */}
      {section === 'Pilots' && (
        <div>
          {pilots.length > 0 && (
            <div style={{ marginBottom: 12, textAlign: 'right' }}>
              <button
                className="vc-btn-outline vc-btn-sm"
                onClick={() => exportCSV('vani-pilots.csv', pilots.map((p) => ({
                  Alias: p.alias,
                  'Age Group': p.ageGroup,
                  Condition: p.condition,
                  Symptoms: p.symptoms,
                  'Affected Parts': (p.impactedParts || []).join('; '),
                  'Gesture Capabilities': (p.gestureCapabilities || []).join('; '),
                  Willingness: p.willingness,
                  'Caregiver Note': p.caregiverNote,
                  Date: p.date,
                })))}
              >
                ⬇️ Export Registrations CSV
              </button>
            </div>
          )}
          {pilots.length === 0 ? (
            <div className="vc-empty">No pilot registrations yet. Form submissions appear here.</div>
          ) : (
            <div className="vc-table-wrap">
              <table className="vc-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Alias</th>
                    <th>Age Group</th>
                    <th>Condition</th>
                    <th>Willingness</th>
                    <th>Affected Parts</th>
                    <th>Platform</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pilots.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td><strong>{p.alias || '—'}</strong></td>
                      <td>{p.ageGroup || '—'}</td>
                      <td>{p.condition || '—'}</td>
                      <td>
                        <span className={`vc-badge ${
                          p.willingness === 'eager' ? 'badge-green'
                          : p.willingness === 'willing' ? 'badge-blue'
                          : 'badge-gray'
                        }`}>
                          {p.willingness}
                        </span>
                      </td>
                      <td className="vc-parts-cell">
                        {(p.impactedParts || []).join(', ') || '—'}
                      </td>
                      <td>{(p.platforms || []).join(', ') || '—'}</td>
                      <td>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Gesture Patterns */}
      {section === 'Gestures' && (
        <div>
          <p className="vc-firebase-note">
            📡 Data below is mock. Production: reads from Firebase Firestore{' '}
            <code>/patients/&#123;id&#125;/gestureSessions</code>
          </p>
          <div className="vc-table-wrap">
            <table className="vc-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Condition</th>
                  <th>Last Session</th>
                  <th>Sessions</th>
                  <th>Primary Gesture</th>
                  <th>Accuracy</th>
                  <th>False Positive</th>
                  <th>Avg Response</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_GESTURE_DATA.map((g) => (
                  <tr key={g.patientAlias}>
                    <td><strong>{g.patientAlias}</strong></td>
                    <td>{g.condition}</td>
                    <td>{g.lastSession}</td>
                    <td>{g.sessions}</td>
                    <td>{g.primaryGesture}</td>
                    <td><strong>{g.accuracy}</strong></td>
                    <td>{g.falsePositiveRate}</td>
                    <td>{g.avgResponseMs} ms</td>
                    <td>
                      <span className={`vc-badge ${TREND_BADGE[g.trend]?.cls || 'badge-gray'}`}>
                        {TREND_BADGE[g.trend]?.label || g.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feedback Management */}
      {section === 'Feedback' && (
        <div className="vc-feedback-admin">
          {pendingFeedback.length > 0 && (
            <div>
              <h3 className="vc-sub-heading">Pending Review ({pendingFeedback.length})</h3>
              <div className="vc-feedback-list">
                {pendingFeedback.map((f) => (
                  <div key={f.id} className="vc-feedback-card vc-feedback-pending">
                    <div className="vc-feedback-meta">
                      <strong>{f.alias || 'Anonymous'}</strong>
                      <span>{f.date}</span>
                      <span>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                    </div>
                    <p>{f.message}</p>
                    <div className="vc-feedback-actions">
                      <button
                        className="vc-btn-sm vc-btn-green"
                        onClick={() => onApproveFeedback(f.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="vc-btn-sm vc-btn-red"
                        onClick={() => onDismissFeedback(f.id)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <h3 className="vc-sub-heading">Approved Feedback ({approvedFeedback.length})</h3>
          {approvedFeedback.length === 0 ? (
            <div className="vc-empty">No approved feedback yet.</div>
          ) : (
            <>
              <div style={{ marginBottom: 12, textAlign: 'right' }}>
                <button
                  className="vc-btn-outline vc-btn-sm"
                  onClick={() => exportCSV('vani-feedback.csv', approvedFeedback.map((f) => ({
                    Alias: f.alias || 'Anonymous',
                    Rating: f.rating,
                    Message: f.message,
                    Date: f.date,
                  })))}
                >
                  ⬇️ Export Feedback CSV
                </button>
              </div>
              <div className="vc-feedback-list">
              {approvedFeedback.map((f) => (
                <div key={f.id} className="vc-feedback-card">
                  <div className="vc-feedback-meta">
                    <strong>{f.alias || 'Anonymous'}</strong>
                    <span>{f.date}</span>
                    <span>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                  </div>
                  <p>{f.message}</p>
                  <div className="vc-feedback-actions">
                    <button
                      className="vc-btn-sm vc-btn-red"
                      onClick={() => onDismissFeedback(f.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
