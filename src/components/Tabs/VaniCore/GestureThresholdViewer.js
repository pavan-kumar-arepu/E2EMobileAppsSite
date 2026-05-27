// GestureThresholdViewer.js
// Fetches patients/{patientId}/thresholdValues/latest and renders read-only threshold cards.
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const THRESHOLD_LABELS = {
  gaze_threshold:       { label: 'Gaze Threshold',       icon: '👁️' },
  head_turn_threshold:  { label: 'Head Turn Threshold',   icon: '🗣️' },
  wink_ear_threshold:   { label: 'Wink / Ear Threshold',  icon: '😉' },
  blink_ear_threshold:  { label: 'Blink / Ear Threshold', icon: '😑' },
};

const fmtTs = (ts) => {
  if (!ts) return '—';
  try {
    const d = new Date(ts);
    return isNaN(d) ? String(ts) : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return String(ts); }
};

const fmtNum = (v) => {
  if (v === null || v === undefined) return '—';
  return typeof v === 'number' ? v.toFixed(4) : String(v);
};

const ThresholdRow = ({ fieldKey, value }) => {
  const meta = THRESHOLD_LABELS[fieldKey] || { label: fieldKey, icon: '🔧' };
  return (
    <div className="vc-thresh-field">
      <span className="vc-thresh-field-label">
        <span style={{ marginRight: 6 }}>{meta.icon}</span>{meta.label}
      </span>
      <span className="vc-thresh-field-value">{fmtNum(value)}</span>
    </div>
  );
};

const ThresholdGroup = ({ title, icon, fields }) => {
  const entries = Object.entries(fields || {});
  if (entries.length === 0) return null;
  return (
    <div className="vc-thresh-section">
      <div className="vc-thresh-sec-header">
        <span className="vc-thresh-sec-icon">{icon}</span>
        <span className="vc-thresh-sec-label">{title}</span>
        <span className="vc-badge badge-green vc-thresh-sec-badge">Calibrated</span>
      </div>
      <div className="vc-thresh-fields">
        {entries.map(([k, v]) => (
          <ThresholdRow key={k} fieldKey={k} value={v} />
        ))}
      </div>
    </div>
  );
};

const GestureThresholdViewer = ({ patientId, patientName, compact = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    setData(null);

    const ref = doc(db, 'patients', patientId, 'thresholdValues', 'latest');
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          setData(snap.data());
        } else {
          setError('No threshold data found for this patient.');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load thresholds: ' + err.message);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return (
      <div className="vc-thresh-state">
        <div className="vc-thresh-spinner" />
        <span>Loading thresholds for <strong>{patientId}</strong>…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vc-thresh-state vc-thresh-error">
        ⚠️ {error}
      </div>
    );
  }

  if (!data) return null;

  const { calibratedValues = {}, liveValues = {}, calibratedAt, updatedAt } = data;

  return (
    <div className={`vc-thresh-card${compact ? ' vc-thresh-compact' : ''}`}>
      {!compact && (
        <div className="vc-thresh-card-header">
          <div className="vc-thresh-patient-info">
            <span className="vc-thresh-avatar">
              {(patientName || patientId).charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="vc-thresh-pname">{patientName || patientId}</div>
              <div className="vc-thresh-pid">{patientId}</div>
            </div>
          </div>
          <div className="vc-thresh-header-right">
            <span className="vc-badge badge-green">✅ Profile Loaded</span>
            {updatedAt && (
              <span className="vc-thresh-updated">🕐 {fmtTs(updatedAt)}</span>
            )}
          </div>
        </div>
      )}

      <div className="vc-thresh-sections">
        <ThresholdGroup
          title="Calibrated Values"
          icon="🎯"
          fields={calibratedValues}
        />
        {Object.keys(liveValues || {}).length > 0 && (
          <ThresholdGroup
            title="Live Values"
            icon="📡"
            fields={liveValues}
          />
        )}
      </div>

      {calibratedAt && (
        <div className="vc-thresh-footer">
          🗓️ Calibrated at: {fmtTs(calibratedAt)}
        </div>
      )}
    </div>
  );
};

export default GestureThresholdViewer;
