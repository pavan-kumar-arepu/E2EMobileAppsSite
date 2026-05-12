// src/components/Tabs/VaniCore/LoginModal.js
import React, { useState } from 'react';
import { ADMIN_CREDENTIALS, DEMO_CARE_CREDENTIALS } from './VaniCoreConfig';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'admin') {
      if (
        username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        onLoginSuccess({ role: 'admin', username });
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
    } else {
      // Patient / Caregiver — demo credentials
      // TODO: Replace with Firebase Auth signInWithEmailAndPassword()
      if (
        username === DEMO_CARE_CREDENTIALS.username &&
        password === DEMO_CARE_CREDENTIALS.password
      ) {
        onLoginSuccess({ role: 'patient', username, alias: 'Pilot-001' });
      } else {
        setError(
          'Credentials not found. Contact your VANI coordinator to receive access.'
        );
      }
    }
  };

  return (
    <div className="vc-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Sign in">
      <div className="vc-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="vc-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="vc-modal-logo">
          <span className="vc-logo-icon">🧠</span>
          <span className="vc-logo-text">VANI</span>
        </div>
        <h2 className="vc-modal-title">Sign In</h2>

        <div className="vc-login-tabs">
          <button
            className={`vc-login-tab ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => switchTab('admin')}
          >
            Admin
          </button>
          <button
            className={`vc-login-tab ${tab === 'care' ? 'active' : ''}`}
            onClick={() => switchTab('care')}
          >
            Patient / Caregiver
          </button>
        </div>

        {tab === 'care' && (
          <p className="vc-login-hint">
            Your login is provided by the VANI coordinator. Gesture data is private to your account.
          </p>
        )}

        <form className="vc-login-form" onSubmit={handleSubmit} noValidate>
          <div className="vc-field">
            <label htmlFor="vc-user">Username</label>
            <input
              id="vc-user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={tab === 'admin' ? 'admin username' : 'your username'}
              autoComplete="username"
              required
            />
          </div>

          <div className="vc-field">
            <label htmlFor="vc-pass">Password</label>
            <div className="vc-pass-wrap">
              <input
                id="vc-pass"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="vc-pass-toggle"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="vc-login-error" role="alert">{error}</p>}

          <button type="submit" className="vc-btn-primary vc-full-width">
            Sign In
          </button>
        </form>

        <p className="vc-modal-footer">
          {tab === 'admin'
            ? 'Secure admin access — all patient data is anonymised in the UI.'
            : 'Patient data is end-to-end private. Firebase migration coming soon.'}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
