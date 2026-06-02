// src/components/Tabs/VaniCore/LoginModal.js
// Real Firebase Authentication — Email/Password + Google Sign-In
// Admin:   username "admin" → mapped to admin@vanicore.app internally
// Others:  full email + password or Google, account created via SignupModal

import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth as fbAuth, db } from '../../../firebase';

// Internal email used for the single admin account
const ADMIN_EMAIL = 'admin@vanicore.app';

const CONTEXT_MESSAGES = {
  download: 'Sign in to access VANI downloads — restricted to registered pilot participants.',
  setup:    'Sign in to view the setup guide — your session data stays private.',
  pilot:    'Sign in to register for the pilot — your data helps calibrate VANI for your needs.',
};

const LoginModal = ({ onClose, onSignup, context }) => {
  const [tab, setTab]           = useState('admin');
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent]   = useState(false);

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setForgotMode(false);
    setResetSent(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(fbAuth, provider);
      const user = cred.user;
      // Create Firestore user doc if first time
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name:      user.displayName || user.email,
          email:     user.email,
          role:      'caregiver',
          createdAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled.');
      } else {
        setError('Google sign-in failed: ' + (err.message || 'Please try again.'));
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Enter your email address above first.'); return; }
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(fbAuth, email.trim().toLowerCase());
      setResetSent(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Login failed. ' + (err.message || 'Please try again.'));
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (tab === 'admin') {
      if (username.trim() !== 'admin') {
        setError('Enter "admin" as the username.');
        setLoading(false);
        return;
      }
      try {
        await signInWithEmailAndPassword(fbAuth, ADMIN_EMAIL, password);
        onClose();
      } catch {
        // First launch: bootstrap admin Firebase account
        try {
          const cred = await createUserWithEmailAndPassword(fbAuth, ADMIN_EMAIL, password);
          await setDoc(doc(db, 'users', cred.user.uid), {
            name: 'Admin', email: ADMIN_EMAIL, role: 'admin', createdAt: serverTimestamp(),
          });
          onClose();
        } catch (err2) {
          if (err2.code === 'auth/email-already-in-use') {
            setError('Invalid admin credentials. Please try again.');
          } else {
            setError('Login failed. Please try again.');
          }
        }
      }
    } else {
      if (!email.trim()) {
        setError('Please enter your email address.');
        setLoading(false);
        return;
      }
      try {
        await signInWithEmailAndPassword(fbAuth, email.trim().toLowerCase(), password);
        onClose();
      } catch (err) {
        if (
          err.code === 'auth/user-not-found'   ||
          err.code === 'auth/wrong-password'   ||
          err.code === 'auth/invalid-credential'
        ) {
          setError('No account found or wrong password. Sign up first.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Please enter a valid email address.');
        } else if (err.code === 'auth/too-many-requests') {
          setError('Too many failed attempts. Please wait and try again.');
        } else {
          setError('Login failed. Please try again.');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="vc-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
    >
      <div className="vc-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="vc-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="vc-modal-title">Sign In</h2>

        {CONTEXT_MESSAGES[context] && (
          <p className="vc-modal-context-msg">{CONTEXT_MESSAGES[context]}</p>
        )}

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
            Caregiver / Patient
          </button>
        </div>

        <form className="vc-login-form" onSubmit={handleSubmit} noValidate>

          {tab === 'admin' ? (
            <div className="vc-field">
              <label htmlFor="vc-user">Username</label>
              <input
                id="vc-user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>
          ) : (
            <div className="vc-field">
              <label htmlFor="vc-email">Email</label>
              <input
                id="vc-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </div>
          )}

          {(!forgotMode) && (
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
          )}

          {error && <p className="vc-login-error" role="alert">{error}</p>}
          {resetSent && (
            <p className="vc-reset-sent" role="status">
              ✅ Reset link sent! Check your inbox.
            </p>
          )}

          {forgotMode ? (
            <>
              <button
                type="button"
                className="vc-btn-primary vc-full-width"
                disabled={loading}
                onClick={handleForgotPassword}
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                className="vc-inline-link vc-full-width vc-mt-8"
                onClick={() => { setForgotMode(false); setResetSent(false); setError(''); }}
              >
                ← Back to Sign In
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="vc-btn-primary vc-full-width"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              {tab === 'care' && (
                <>
                  <div className="vc-divider"><span>or</span></div>
                  <button
                    type="button"
                    className="vc-btn-google vc-full-width"
                    disabled={loading}
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="vc-google-icon"
                    />
                    Sign in with Google
                  </button>
                  <div style={{ textAlign: 'right', marginTop: 6 }}>
                    <button
                      type="button"
                      className="vc-inline-link"
                      onClick={() => { setForgotMode(true); setError(''); }}
                    >
                      Forgot password?
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>

        {tab === 'care' && (
          <p className="vc-modal-footer">
            New here?{' '}
            <button
              className="vc-inline-link"
              onClick={() => { onClose(); onSignup(); }}
            >
              Create an account
            </button>
          </p>
        )}
        {tab === 'admin' && (
          <p className="vc-modal-footer">
            Secure admin access — all patient data is anonymised in the UI.
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
