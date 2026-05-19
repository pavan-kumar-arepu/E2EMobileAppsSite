// src/components/Tabs/VaniCore/AdminDashboard.js
import React, { useState } from 'react';
import { BUILDS } from './VaniCoreConfig';

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

const SECTIONS = ['Overview', 'Patients', 'Pilots', 'Gestures', 'Feedback'];

const STATUS_BADGE = {
  active:   { cls: 'badge-green', label: 'Active' },
  inactive: { cls: 'badge-gray',  label: 'Inactive' },
  pending:  { cls: 'badge-blue',  label: 'Pending' },
};

const GESTURE_ICONS = {
  LEFT:        '👁️←',
  RIGHT:       '👁️→',
  BLINK:       '😑',
  DOUBLE_BLINK:'😤',
  WINK_LEFT:   '😉',
  WINK_RIGHT:  '🙃',
  MOUTH_OPEN:  '👄',
  HEAD_LEFT:   '↩️',
  HEAD_RIGHT:  '↪️',
};

const fmtTs = (ts) => {
  if (!ts) return '—';
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return isNaN(d) ? String(ts) : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return String(ts); }
};

const PatientRow = ({ pat, idx }) => {
  const [open, setOpen] = useState(false);
  const statusCfg = STATUS_BADGE[pat.status] || STATUS_BADGE.pending;
  const unread = (pat._pendingNotifs || []).filter(n => !n.read).length;
  return (
    <>
      <tr
        className={'vc-pat-row' + (open ? ' vc-pat-row-open' : '')}
        onClick={() => setOpen(o => !o)}
        title="Click to expand patient details"
        style={{ cursor: 'pointer' }}
      >
        <td><strong>#{idx + 1}</strong></td>
        <td>
          <div className="vc-pat-name">{pat.patient_name || '—'}</div>
          <div className="vc-pat-id">{pat.patient_id || pat._fsId}</div>
        </td>
        <td>
          <span className={'vc-badge ' + statusCfg.cls}>{statusCfg.label}</span>
        </td>
        <td>{pat.device_id || '—'}</td>
        <td>{pat.current_stage || '—'}</td>
        <td>
          <span className={'vc-badge ' + (pat.device_pairing?.paired_devices?.qr_code_generated ? 'badge-green' : 'badge-gray')}>
            {pat.device_pairing?.paired_devices?.qr_code_generated ? '✅ Paired' : '⏳ Unpaired'}
          </span>
        </td>
        <td><strong>{pat._gestureCount ?? '—'}</strong></td>
        <td>
          {unread > 0
            ? <span className="vc-badge badge-orange">{unread} unread</span>
            : <span className="vc-badge badge-gray">{(pat._pendingNotifs || []).length}</span>}
        </td>
        <td style={{ fontSize: '.78rem' }}>{fmtTs(pat.created_at)}</td>
        <td className="vc-pat-expand-btn">{open ? '▲' : '▼'}</td>
      </tr>
      {open && (
        <tr className="vc-pat-detail-row">
          <td colSpan={10}>
            <div className="vc-pat-detail">
              <div className="vc-pat-detail-col">
                <div className="vc-pat-detail-heading">🤚 Recent Gesture Events</div>
                {(pat._recentGestures || []).length === 0
                  ? <p className="vc-pat-detail-empty">No gesture data yet.</p>
                  : (pat._recentGestures || []).slice(0, 5).map((g, i) => (
                    <div key={i} className="vc-pat-gesture-row">
                      <span className="vc-pat-gesture-icon">{GESTURE_ICONS[g.gesture] || '🤖'}</span>
                      <span className="vc-pat-gesture-name">{g.gesture}</span>
                      <span className="vc-pat-gesture-conf">conf: {g.confidence ?? '—'}</span>
                      <span className="vc-pat-gesture-ts">{fmtTs(g.timestamp)}</span>
                    </div>
                  ))}
              </div>
              <div className="vc-pat-detail-col">
                <div className="vc-pat-detail-heading">🔔 Pending Notifications</div>
                {(pat._pendingNotifs || []).length === 0
                  ? <p className="vc-pat-detail-empty">No pending notifications.</p>
                  : (pat._pendingNotifs || []).slice(0, 5).map((n, i) => (
                    <div key={i} className={'vc-pat-notif-row' + (!n.read ? ' unread' : '')}>
                      <span className="vc-pat-notif-gesture">{GESTURE_ICONS[n.gesture] || '🤖'} {n.gesture}</span>
                      <span className="vc-pat-notif-action">{n.intended_action}</span>
                      <span className="vc-pat-notif-ts">{fmtTs(n.timestamp)}</span>
                    </div>
                  ))}
              </div>
              <div className="vc-pat-detail-col">
                <div className="vc-pat-detail-heading">📟 Device &amp; Stage Info</div>
                <div className="vc-pat-info-grid">
                  <div className="vc-pat-info-row"><span>Device ID</span><strong>{pat.device_id || '—'}</strong></div>
                  <div className="vc-pat-info-row"><span>Stage</span><strong>{pat.current_stage || '—'}</strong></div>
                  <div className="vc-pat-info-row"><span>QR Paired</span><strong>{pat.device_pairing?.paired_devices?.qr_code_generated ? 'Yes' : 'No'}</strong></div>
                  <div className="vc-pat-info-row"><span>Created</span><strong>{fmtTs(pat.created_at)}</strong></div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const AdminDashboard = ({ pilots, feedback, downloads, patients = [], onApproveFeedback, onDismissFeedback }) => {
  const [section, setSection] = useState('Overview');

  const totalDownloads =
    BUILDS.reduce((sum, b) => sum + b.baseDownloads, 0) +
    BUILDS.reduce((sum, b) => sum + (downloads[b.id] || 0), 0);

  const approvedFeedback = feedback.filter((f) => f.approved);
  const pendingFeedback = feedback.filter((f) => !f.approved);
  const activePatients = patients.filter(p => p.status === 'active');
  const pairedPatients = patients.filter(p => p.device_pairing?.paired_devices?.qr_code_generated);

  return (
    <section className="vc-section vc-admin">
      <div className="vc-admin-header">
        <h2 className="vc-section-title">
          <span className="vc-title-icon">⚙️</span> Admin Dashboard
        </h2>
        <p className="vc-section-sub">Live patient data · Pilot registrations · Community feedback</p>
      </div>

      <div className="vc-admin-nav">
        {SECTIONS.map((s) => (
          <button
            key={s}
            className={'vc-admin-nav-btn ' + (section === s ? 'active' : '')}
            onClick={() => setSection(s)}
          >
            {s}
            {s === 'Feedback' && pendingFeedback.length > 0 && (
              <span className="vc-badge-dot">{pendingFeedback.length}</span>
            )}
            {s === 'Patients' && patients.length > 0 && (
              <span className="vc-badge-dot vc-badge-dot-green">{patients.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {section === 'Overview' && (
        <div className="vc-grid-3">
          <div className="vc-stat-card">
            <div className="vc-stat-num">{patients.length}</div>
            <div className="vc-stat-label">Total Patients (Firestore)</div>
          </div>
          <div className="vc-stat-card">
            <div className="vc-stat-num">{activePatients.length}</div>
            <div className="vc-stat-label">Active Patients</div>
          </div>
          <div className="vc-stat-card">
            <div className="vc-stat-num">{pairedPatients.length}</div>
            <div className="vc-stat-label">Devices Paired</div>
          </div>
          <div className="vc-stat-card">
            <div className="vc-stat-num">{pilots.length}</div>
            <div className="vc-stat-label">Pilot Registrations</div>
          </div>
          <div className="vc-stat-card">
            <div className="vc-stat-num">{totalDownloads}</div>
            <div className="vc-stat-label">Total Downloads</div>
          </div>
          <div className="vc-stat-card vc-stat-pending">
            <div className="vc-stat-num">{pendingFeedback.length}</div>
            <div className="vc-stat-label">Feedback Pending Review</div>
          </div>
        </div>
      )}

      {/* Patients */}
      {section === 'Patients' && (
        <div>
          <div className="vc-admin-section-bar">
            <p className="vc-firebase-note">
              📡 Live — Firestore <code>patients</code> · <code>gestures/&#123;id&#125;/events</code> · <code>notifications/&#123;id&#125;/pending</code>. Click a row to expand.
            </p>
            {patients.length > 0 && (
              <button
                className="vc-btn-outline vc-btn-sm"
                onClick={() => exportCSV('vani-patients.csv', patients.map(p => ({
                  PatientID:    p.patient_id || p._fsId,
                  Name:         p.patient_name || '',
                  Status:       p.status || '',
                  DeviceID:     p.device_id || '',
                  Stage:        p.current_stage || '',
                  QRPaired:     p.device_pairing?.paired_devices?.qr_code_generated ? 'Yes' : 'No',
                  GestureCount: p._gestureCount || 0,
                  PendingNotifs: (p._pendingNotifs || []).length,
                  CreatedAt:    p.created_at ? String(p.created_at) : '',
                })))}
              >
                ⬇️ Export Patients CSV
              </button>
            )}
          </div>
          {patients.length === 0 ? (
            <div className="vc-empty">No patients found in Firestore yet.</div>
          ) : (
            <div className="vc-table-wrap">
              <table className="vc-table vc-pat-table">
                <thead>
                  <tr>
                    <th>#</th><th>Patient</th><th>Status</th><th>Device ID</th>
                    <th>Stage</th><th>Pairing</th><th>Gestures</th>
                    <th>Notifications</th><th>Created</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pat, i) => (
                    <PatientRow key={pat._fsId || i} pat={pat} idx={i} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pilots */}
      {section === 'Pilots' && (
        <div>
          {pilots.length > 0 && (
            <div style={{ marginBottom: 12, textAlign: 'right' }}>
              <button
                className="vc-btn-outline vc-btn-sm"
                onClick={() => exportCSV('vani-pilots.csv', pilots.map(p => ({
                  Alias: p.alias, 'Age Group': p.ageGroup, Condition: p.condition,
                  Symptoms: p.symptoms, 'Affected Parts': (p.impactedParts || []).join('; '),
                  'Gesture Capabilities': (p.gestureCapabilities || []).join('; '),
                  Willingness: p.willingness, 'Caregiver Note': p.caregiverNote, Date: p.date,
                })))}
              >
                ⬇️ Export Registrations CSV
              </button>
            </div>
          )}
          {pilots.length === 0 ? (
            <div className="vc-empty">No pilot registrations yet.</div>
          ) : (
            <div className="vc-table-wrap">
              <table className="vc-table">
                <thead>
                  <tr>
                    <th>#</th><th>Alias</th><th>Age Group</th><th>Condition</th>
                    <th>Willingness</th><th>Affected Parts</th><th>Platform</th><th>Date</th>
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
                        <span className={'vc-badge ' + (p.willingness === 'eager' ? 'badge-green' : p.willingness === 'willing' ? 'badge-blue' : 'badge-gray')}>
                          {p.willingness}
                        </span>
                      </td>
                      <td className="vc-parts-cell">{(p.impactedParts || []).join(', ') || '—'}</td>
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

      {/* Gestures */}
      {section === 'Gestures' && (
        <div>
          <p className="vc-firebase-note">
            📡 Live gesture summary per patient from Firestore <code>gestures/&#123;patientId&#125;/events</code>
          </p>
          {patients.length === 0 ? (
            <div className="vc-empty">No patient gesture data available.</div>
          ) : (
            <div className="vc-table-wrap">
              <table className="vc-table">
                <thead>
                  <tr>
                    <th>Patient</th><th>Device</th><th>Total Events</th>
                    <th>Last 5 Gestures</th><th>Latest Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => {
                    const recent = p._recentGestures || [];
                    const latest = recent[0];
                    return (
                      <tr key={p._fsId}>
                        <td>
                          <div><strong>{p.patient_name || '—'}</strong></div>
                          <div style={{ fontSize: '.75rem', color: 'var(--vc-text-3)' }}>{p.patient_id || p._fsId}</div>
                        </td>
                        <td>{p.device_id || '—'}</td>
                        <td><strong>{p._gestureCount ?? '—'}</strong></td>
                        <td>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {recent.length === 0
                              ? <span style={{ color: 'var(--vc-text-3)', fontSize: '.8rem' }}>—</span>
                              : recent.map((g, i) => (
                                <span key={i} className="vc-gesture-chip" title={g.gesture}>
                                  {GESTURE_ICONS[g.gesture] || '🤖'}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td>{latest ? fmtTs(latest.timestamp) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
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
                      <button className="vc-btn-sm vc-btn-green" onClick={() => onApproveFeedback(f.id)}>Approve</button>
                      <button className="vc-btn-sm vc-btn-red" onClick={() => onDismissFeedback(f.id)}>Dismiss</button>
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
                  onClick={() => exportCSV('vani-feedback.csv', approvedFeedback.map(f => ({
                    Alias: f.alias || 'Anonymous', Rating: f.rating, Message: f.message, Date: f.date,
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
                      <button className="vc-btn-sm vc-btn-red" onClick={() => onDismissFeedback(f.id)}>Remove</button>
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
