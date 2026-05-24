// GestureThresholdViewer.js
// Fetches patients/{patientId}/gestureThresholds/profile and renders read-only threshold cards.
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const SECTION_META = {
  eye:   { icon: '👁️', label: 'Eye Gaze & Blink',  color: '#6a11cb' },
  face:  { icon: '😐', label: 'Face Stability',     color: '#2575fc' },
  head:  { icon: '🗣️', label: 'Head Movement',      color: '#00b894' },
  mouth: { icon: '👄', label: 'Mouth',               color: '#e17055' },
  hand:  { icon: '✋', label: 'Hand',                color: '#6c3483' },
};

const FIELD_LABELS = {
  blinkThreshold:          { label: 'Blink Threshold',          unit: '' },
  doubleBlinkWindowMs:     { label: 'Double Blink Window',      unit: ' ms' },
  downGazeThreshold:       { label: 'Gaze Down Threshold',      unit: '' },
  leftGazeThreshold:       { label: 'Gaze Left Threshold',      unit: '' },
  rightGazeThreshold:      { label: 'Gaze Right Threshold',     unit: '' },
  upGazeThreshold:         { label: 'Gaze Up Threshold',        unit: '' },
  faceStabilityThreshold:  { label: 'Face Stability Threshold', unit: '' },
  downTiltAngle:           { label: 'Down Tilt Angle',          unit: '°' },
  leftTurnAngle:           { label: 'Left Turn Angle',          unit: '°' },
  rightTurnAngle:          { label: 'Right Turn Angle',         unit: '°' },
  upTiltAngle:             { label: 'Up Tilt Angle',            unit: '°' },
  enabled:                 { label: 'Enabled',                  unit: '' },
};

const fmtValue = (key, value) => {
  if (typeof value === 'boolean') return value ? '✓ Yes' : '✗ No';
  const meta = FIELD_LABELS[key];
  return `${value}${meta?.unit ?? ''}`;
};

const ThresholdSection = ({ sectionKey, fields }) => {
  const meta = SECTION_META[sectionKey] || { icon: '🔧', label: sectionKey, color: '#888' };
  const enabled = fields.enabled;
  const entries = Object.entries(fields).filter(([k]) => k !== 'enabled');

  return (
    <div className="vc-thresh-section" style={{ '--sec-color': meta.color }}>
      <div className="vc-thresh-sec-header">
        <span className="vc-thresh-sec-icon">{meta.icon}</span>
        <span className="vc-thresh-sec-label">{meta.label}</span>
        <span className={`vc-badge ${enabled !== false ? 'badge-green' : 'badge-gray'} vc-thresh-sec-badge`}>
          {enabled !== false ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      <div className="vc-thresh-fields">
        {entries.map(([key, value]) => {
          const fm = FIELD_LABELS[key] || { label: key, unit: '' };
          return (
            <div key={key} className="vc-thresh-field">
              <span className="vc-thresh-field-label">{fm.label}</span>
              <span className="vc-thresh-field-value">{fmtValue(key, value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GestureThresholdViewer = ({ patientId, patientName, compact = false }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    setProfile(null);

    const ref = doc(db, 'patients', patientId, 'gestureThresholds', 'profile');
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          setProfile(snap.data());
          setLastUpdated(new Date().toLocaleTimeString('en-IN'));
        } else {
          setError('No threshold profile found for this patient.');
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

  if (!profile) return null;

  // Only render top-level object fields as sections; skip primitives at root level
  const sections = Object.entries(profile).filter(
    ([, v]) => v !== null && typeof v === 'object' && !Array.isArray(v)
  );

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
            {lastUpdated && (
              <span className="vc-thresh-updated">🕐 {lastUpdated}</span>
            )}
          </div>
        </div>
      )}

      <div className="vc-thresh-sections">
        {sections.map(([key, fields]) => (
          <ThresholdSection key={key} sectionKey={key} fields={fields} />
        ))}
      </div>

      <div className="vc-thresh-footer">
        📌 These values are calibrated by VaniCore based on the patient's personal gesture baseline. Read-only.
      </div>
    </div>
  );
};

export default GestureThresholdViewer;
