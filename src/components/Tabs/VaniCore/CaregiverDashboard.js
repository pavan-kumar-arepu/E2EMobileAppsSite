// CaregiverDashboard.js
// Caregiver view: enter patient IDs, monitor N patients' gesture threshold profiles.
// Multiple patients supported with persistent tabs. Read-only.
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import GestureThresholdViewer from './GestureThresholdViewer';

const LS_KEY = 'vc_cg_patients';

const readSaved = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
};

const CaregiverDashboard = ({ auth }) => {
  const [patientIds, setPatientIds] = useState(readSaved);
  const [patientNames, setPatientNames] = useState({});
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [resolving, setResolving] = useState(false);
  const [addError, setAddError] = useState('');

  // Persist patient list
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(patientIds));
  }, [patientIds]);

  // Auto-select first patient when list changes
  useEffect(() => {
    if (patientIds.length > 0 && (!selected || !patientIds.includes(selected))) {
      setSelected(patientIds[0]);
    }
    if (patientIds.length === 0) setSelected(null);
  }, [patientIds]);

  // Resolve names for already-saved patients on mount
  useEffect(() => {
    patientIds.forEach(async (id) => {
      if (patientNames[id]) return;
      try {
        const snap = await getDoc(doc(db, 'patients', id));
        if (snap.exists()) {
          setPatientNames((prev) => ({
            ...prev,
            [id]: snap.data().patient_name || id,
          }));
        }
      } catch { /* silent */ }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async () => {
    const id = input.trim();
    if (!id) return;
    const normId = id.toUpperCase().startsWith('PAT-') ? id.trim() : id.trim();
    if (patientIds.includes(normId)) {
      setAddError('This patient is already being monitored.');
      return;
    }
    setResolving(true);
    setAddError('');
    try {
      const snap = await getDoc(doc(db, 'patients', normId));
      if (!snap.exists()) {
        setAddError(`Patient "${normId}" not found in Firestore. Please check the ID.`);
        setResolving(false);
        return;
      }
      const name = snap.data().patient_name || normId;
      setPatientNames((prev) => ({ ...prev, [normId]: name }));
      setPatientIds((prev) => [...prev, normId]);
      setSelected(normId);
      setInput('');
    } catch (e) {
      setAddError('Error looking up patient: ' + e.message);
    }
    setResolving(false);
  };

  const handleRemove = (id) => {
    const updated = patientIds.filter((p) => p !== id);
    setPatientIds(updated);
    if (selected === id) setSelected(updated[0] || null);
  };

  return (
    <section className="vc-section vc-cg-dash">
      {/* Header */}
      <h2 className="vc-section-title">
        <span className="vc-title-icon">👤</span> Caregiver Dashboard
      </h2>
      <p className="vc-section-sub">
        Enter a patient ID to view their personalized gesture threshold profile.
        You can monitor multiple patients and switch between them instantly.
      </p>

      {/* Add patient */}
      <div className="vc-cg-add-panel">
        <div className="vc-cg-add-label">Track a new patient</div>
        <div className="vc-cg-add-row">
          <input
            className="vc-cg-input"
            type="text"
            placeholder="Patient ID — e.g. PAT-20260524135609"
            value={input}
            onChange={(e) => { setInput(e.target.value); setAddError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            disabled={resolving}
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

      {/* Patient selector tabs */}
      {patientIds.length > 0 && (
        <div className="vc-cg-patient-tabs">
          <div className="vc-cg-tabs-label">
            Monitored Patients ({patientIds.length})
          </div>
          <div className="vc-cg-tabs">
            {patientIds.map((id) => (
              <div
                key={id}
                className={`vc-cg-tab${selected === id ? ' active' : ''}`}
                onClick={() => setSelected(id)}
              >
                <span className="vc-cg-tab-avatar">
                  {(patientNames[id] || id).charAt(0).toUpperCase()}
                </span>
                <div className="vc-cg-tab-text">
                  <div className="vc-cg-tab-name">{patientNames[id] || id}</div>
                  <div className="vc-cg-tab-id">{id}</div>
                </div>
                <button
                  className="vc-cg-tab-remove"
                  onClick={(e) => { e.stopPropagation(); handleRemove(id); }}
                  title="Stop monitoring this patient"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Threshold viewer */}
      {selected ? (
        <GestureThresholdViewer
          key={selected}
          patientId={selected}
          patientName={patientNames[selected]}
        />
      ) : (
        <div className="vc-empty vc-cg-empty">
          <div className="vc-cg-empty-icon">🔍</div>
          <p>No patients added yet.</p>
          <p className="vc-cg-empty-hint">
            Enter a Patient ID above to start monitoring their real-time gesture threshold profile.
          </p>
        </div>
      )}
    </section>
  );
};

export default CaregiverDashboard;
