// src/components/Tabs/VaniCore/SignupModal.js
// Caregiver / Patient self-registration via Firebase Auth + Firestore

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth as fbAuth, db } from '../../../firebase';

const SignupModal = ({ onClose, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    role:     'caregiver',
    password: '',
    confirm:  '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(fbAuth, provider);
      const user = cred.user;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name:      user.displayName || user.email,
          email:     user.email,
          role:      'caregiver',
          createdAt: serverTimestamp(),
        });
      }
      setDone(true);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled.');
      } else {
        setError('Google sign-in failed: ' + (err.message || 'Please try again.'));
      }
    }
    setLoading(false);
  };

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())            { setError('Please enter your full name.'); return; }
    if (!form.email.trim())           { setError('Please enter your email.'); return; }
    if (form.password.length < 6)     { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        fbAuth,
        form.email.trim().toLowerCase(),
        form.password
      );
      await setDoc(doc(db, 'users', cred.user.uid), {
        name:      form.name.trim(),
        email:     form.email.trim().toLowerCase(),
        role:      form.role,
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak — use at least 6 characters.');
      } else {
        setError('Sign up failed. Please try again.');
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
      aria-label="Create account"
    >
      <div className="vc-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="vc-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="vc-modal-title">Create Account</h2>

        {done ? (
          <div className="vc-signup-success">
            <div className="vc-success-icon">✅</div>
            <p>Account created! You are now signed in.</p>
            <button className="vc-btn-primary vc-full-width" onClick={onClose}>
              Continue to Portal
            </button>
          </div>
        ) : (
          <>
            <form className="vc-login-form" onSubmit={handleSubmit} noValidate>

              <div className="vc-field">
                <label htmlFor="su-name">Full Name <span className="vc-required">*</span></label>
                <input
                  id="su-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="vc-field">
                <label htmlFor="su-email">Email <span className="vc-required">*</span></label>
                <input
                  id="su-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="vc-field">
                <label htmlFor="su-role">I am a</label>
                <select
                  id="su-role"
                  value={form.role}
                  onChange={(e) => set('role', e.target.value)}
                >
                  <option value="caregiver">Caregiver</option>
                  <option value="patient">Patient / Self</option>
                </select>
              </div>

              <div className="vc-field">
                <label htmlFor="su-pass">Password <span className="vc-required">*</span></label>
                <div className="vc-pass-wrap">
                  <input
                    id="su-pass"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    placeholder="min 6 characters"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="vc-pass-toggle"
                    onClick={() => setShowPass((s) => !s)}
                    aria-label={showPass ? 'Hide' : 'Show'}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="vc-field">
                <label htmlFor="su-confirm">Confirm Password <span className="vc-required">*</span></label>
                <input
                  id="su-confirm"
                  type={showPass ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={(e) => set('confirm', e.target.value)}
                  placeholder="repeat password"
                  autoComplete="new-password"
                  required
                />
              </div>

              {error && <p className="vc-login-error" role="alert">{error}</p>}

              <button
                type="submit"
                className="vc-btn-primary vc-full-width"
                disabled={loading}
              >
                {loading ? 'Creating Account…' : 'Sign Up'}
              </button>
            </form>

            <div className="vc-divider"><span>or</span></div>
            <button
              type="button"
              className="vc-btn-google vc-full-width"
              disabled={loading}
              onClick={handleGoogleSignUp}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="vc-google-icon"
              />
              Sign up with Google
            </button>

            <p className="vc-modal-footer">
              Already have an account?{' '}
              <button className="vc-inline-link" onClick={onSwitchToLogin}>
                Sign In
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupModal;
