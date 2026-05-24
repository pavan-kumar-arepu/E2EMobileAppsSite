// CaregiverDashboard.js
// Caregiver view: enter patient IDs, see full patient info + gesture thresholds.
// Supports multiple patients with persistent tabs. Read-only.
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import GestureThresholdViewer from './GestureThresholdViewer';

const LS_KEY = 'vc_cg_patients';
const readSaved = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };

const fmtTs = (ts) => {
  if (!ts) return '—';
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return isNaN(d) ? String(ts) : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return String(ts); }
};

// ── Patient Info Table ────────────────────────────────────────────────────────
const PatientInfoTable = ({ data }) => {
  const rows = [
    { label: 'Patient Name',   value: data.patient_name || '—' },
    { label: 'Patient ID',     value: data.patient_id   || '—' },
    { label: 'Device ID',      value: data.device_id    || '—' },
    { label: 'Current Stage',  value: data.current_stage|| '—' },
    { label: 'Status',         value: data.status       || '—', badge: true },
    { label: 'Device Paired',  value: data.device_pairing?.paired_devices?.qr_code_generated ? 'Yes ✅' : 'No ⏳' },
    { label: 'Created At',     value: fmtTs(data.created_at) },
  ];

  const statusColor = data.status === 'active' ? 'badge-green' : data.status === 'inactive' ? 'badge-gray' : 'badge-blue';

  return (
    <div className="vc-cg-info-card">
      <div className="vc-cg-info-header">
        <span className="vc-cg-info-avatar">
          {(data.patient_name || data.patient_id || 'P').charAt(0).toUpperCase()}
        </span>
        <div>
          <div className="vc-cg-info-name">{data.patient_name || data.patient_id}</div>
          <span className={`vc-badge ${statusColor}`}>{data.status || 'unknown'}</span>
        </div>
      </div>
      <table className="vc-cg-info-table">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="vc-cg-info-label">{r.label}</td>
              <td className="vc-cg-info-value">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const CaregiverDashboard = ({ auth }) => {
  const [patientIds, setPatientIds]   = useState(readSaved);
  const [patientData, setPatientData] = useState({});   // { id: firestoreDoc }
  const [selected, setSelected]       = useState(null);
  const [input, setInput]             = useState('');
  const [resolving, setResolving]     = useState(false);
  const [addError, setAddError]       = useState('');

  // Persist list
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(patientIds));
  }, [patientIds]);

  // Auto-select first
  useEffect(() => {
    if (patientIds.length > 0 && (!selected || !patientIds.includes(selected))) {
      setSelected(patientIds[0]);
    }
    if (patientIds.length === 0) setSelected(null);
  }, [patientIds]);

  // Re-fetch data for already-saved patients on mount
  useEffect(() => {
    patientIds.forEach(async (id) => {
      if (patientData[id]) return;
      try {
        const snap = await getDoc(doc(db, 'patients', id));
        if (snap.exists()) {
          setPatientData((prev) => ({ ...prev, [id]: snap.data() }));
        }
      } catch { /* silent */ }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async () => {
    const id = input.trim();
    if (!id) return;
    if (patientIds.includes(id)) {
      setAddError('This patient is already being monitored.');
      return;
    }
    setResolving(true);
    setAddError('');
    try {
      const snap = await getDoc(doc(db, 'patients', id));
      if (!snap.exists()) {
        setAddError(`Patient ID "${id}" not found. Please check and try again.`);
        setResolving(false);
        return;
      }
      setPatientData((prev) => ({ ...prev, [id]: snap.data() }));
      setPatientIds((prev) => [...prev, id]);
      setSelected(id);
      setInput('');
    } catch (e) {
      setAddError('Error looking up patient: ' + e.message);
    }
    setResolving(false);
  };

  const handleRemove = (id) => {
    const updated = patientIds.filter((p) => p !== id);
    setPatientIds(updated);
    setPatientData((prev) => { const c = { ...prev }; delete c[id]; return c; });
    if (selected === id) setSelected(updated[0] || null);
  };

  const selectedData = selected ? patientData[selected] : null;

  return (
    <section className="vc-section vc-cg-dash">
      <h2 className="vc-section-title">
        <span className="vc-title-icon">👤</span> Caregiver Dashboard
      </h2>
      <p className="vc-section-sub">
        Enter a Patient ID to view their profile and gesture threshold settings.
        Add as many patients as needed and switch between them instantly.
      </p>

      {/* ── Add patient panel ── */}
      <div className="vc-cg-add-panel">
        <div className="vc-cg-add-label">Add a Patient to Monitor</div>
        <div className="vc-cg-add-row">
          <input
            className="vc-cg-input"
            type="text"
            placeholder="Patient ID — e.g. PAT-20260524135609"
            value={input}
            onChange={(e) => { setInput(e.target.value); setAddError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            disabled={resolving}
            autoFocus
          />
          <button
            className="vc-btn-primary vc-btn-sm"
            onClick={handleAdd}
            disabled={resolving || !input.trim()}
          >
            {resolving ? '⏳ Checking…' : '+ Add Patient'}
          </button>
        </div>
        {addError && <div className="vc-cg-error">⚠️ {addError}</div>}
      </div>

      {/* ── Patient tab pills ── */}
      {patientIds.length > 0 && (
        <div className="vc-cg-patient-tabs">
          <div className="vc-cg-tabs-label">Monitored Patients ({patientIds.length})</div>
          <div className="vc-cg-tabs">
            {patientIds.map((id) => {
              const d = patientData[id];
              const name = d?.patient_name || id;
              return (
                <div
                  key={id}
                  className={`vc-cg-tab${selected === id ? ' active' : ''}`}
                  onClick={() => setSelected(id)}
                >
                  <span className="vc-cg-tab-avatar">{name.charAt(0).toUpperCase()}</span>
                  <div className="vc-cg-tab-text">
                    <div className="vc-cg-tab-name">{name}</div>
                    <div className="vc-cg-tab-id">{id}</div>
                  </div>
                  <button
                    className="vc-cg-tab-remove"
                    onClick={(e) => { e.stopPropagation(); handleRemove(id); }}
                    title="Stop monitoring"
                  >✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Patient detail ── */}
      {selected && !selectedData && (
        <div className="vc-thresh-state">
          <div className="vc-thresh-spinner" />
          <span>Loading data for <strong>{selected}</strong>…</span>
        </div>
      )}

      {selected && selectedData && (
        <>
          <PatientInfoTable data={selectedData} />
          <div className="vc-cg-thresh-heading">
            <span>📊</span> Gesture Threshold Profile
          </div>
          <GestureThresholdViewer
            key={selected}
            patientId={selected}
            patientName={selectedData.patient_name}
          />
        </>
      )}

      {/* ── Empty state ── */}
      {patientIds.length === 0 && (
        <div className="vc-empty vc-cg-empty">
          <div className="vc-cg-empty-icon">🔍</div>
          <p>No patients added yet.</p>
          <p className="vc-cg-empty-hint">
            Enter a Patient ID above to see their full profile and gesture thresholds.
          </p>
        </div>
      )}
    </section>
  );
};

export default CaregiverDashboard;
