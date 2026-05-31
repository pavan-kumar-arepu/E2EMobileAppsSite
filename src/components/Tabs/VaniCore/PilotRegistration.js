// src/components/Tabs/VaniCore/PilotRegistration.js
import React, { useState } from 'react';
import { db } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const PilotRegistration = ({ onSubmitSuccess }) => {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    // Participant Details
    fullName: '',
    email: '',
    country: '',
    relationshipToParticipant: '',
    
    // Patient Information
    condition: '',
    ageGroup: '',
    
    // Functional Assessment
    functionalAbilities: {
      eyeMovement: '',
      blink: '',
      smile: '',
      openMouth: '',
      turnHead: '',
      speechAvailable: '',
      handMovement: '',
    },
    
    // Device Availability
    availableDevices: [],
    
    // Pilot Goals
    pilotGoals: '',
    
    // Additional Notes
    additionalNotes: '',
    
    // Consent
    consent1: false,
    consent2: false,
    consent3: false,
  });

  const relationshipOptions = [
    'Patient',
    'Caregiver',
    'Family Member',
    'Therapist',
    'Researcher',
    'Accessibility Advocate',
    'Other',
  ];

  const conditionOptions = [
    'ALS',
    'MND',
    "Parkinson's Disease",
    'Stroke Recovery',
    'Cerebral Palsy',
    'Other',
  ];

  const ageGroupOptions = [
    'Under 18',
    '18 - 40',
    '41 - 60',
    '61+',
  ];

  const functionalAbilitiesOptions = [
    { key: 'eyeMovement', label: 'Eye Movement' },
    { key: 'blink', label: 'Blink' },
    { key: 'smile', label: 'Smile' },
    { key: 'openMouth', label: 'Open Mouth' },
    { key: 'turnHead', label: 'Turn Head' },
    { key: 'speechAvailable', label: 'Speech Available' },
    { key: 'handMovement', label: 'Hand Movement' },
  ];

  const abilityOptions = ['Yes', 'Partial', 'No'];

  const deviceOptions = [
    'Windows PC',
    'Mac',
    'Android Phone',
    'iPhone',
    'External Webcam',
    'Built-in Webcam',
    'Raspberry Pi',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    if (!form.relationshipToParticipant) newErrors.relationshipToParticipant = 'Please select a relationship';
    if (!form.condition) newErrors.condition = 'Please select a condition';
    if (!form.ageGroup) newErrors.ageGroup = 'Please select an age group';

    // Check at least one functional ability is selected
    const hasAnyAbility = Object.values(form.functionalAbilities).some(v => v);
    if (!hasAnyAbility) newErrors.functionalAbilities = 'Please indicate at least one functional ability';

    if (form.availableDevices.length === 0) newErrors.availableDevices = 'Please select at least one device';
    if (!form.pilotGoals.trim()) newErrors.pilotGoals = 'Please describe your pilot goals';

    if (!form.consent1) newErrors.consent1 = 'Please acknowledge this is a pilot evaluation';
    if (!form.consent2) newErrors.consent2 = 'Please consent to participate';
    if (!form.consent3) newErrors.consent3 = 'Please acknowledge that participation is not guaranteed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'pilotRegistrations'), {
        ...form,
        pilotStatus: 'pending',
        submittedAt: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });
      setStep('success');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error('Registration submission error:', err);
      setErrors({ submit: 'Failed to submit registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeviceToggle = (device) => {
    setForm(prev => ({
      ...prev,
      availableDevices: prev.availableDevices.includes(device)
        ? prev.availableDevices.filter(d => d !== device)
        : [...prev.availableDevices, device],
    }));
  };

  const handleAbilityChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      functionalAbilities: {
        ...prev.functionalAbilities,
        [key]: value,
      },
    }));
  };

  if (step === 'success') {
    return (
      <section className="vc-section vc-pilot-registration">
        <div className="vc-success-container">
          <div className="vc-success-icon">✅</div>
          <h2 className="vc-success-title">Registration Submitted</h2>
          <p className="vc-success-message">
            Thank you for your interest in Vani Assistive Care.
          </p>
          <p className="vc-success-details">
            Your pilot registration request has been received successfully.
          </p>
          <p className="vc-success-footer">
            I will review your submission and contact you regarding the next steps.
          </p>
          <p className="vc-success-closing">
            Thank you for helping us build more accessible communication solutions for 
            individuals living with ALS, MND, and related conditions.
          </p>
          <button 
            className="vc-btn-primary vc-success-btn"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="vc-section vc-pilot-registration">
      <div className="vc-pr-header">
        <h1 className="vc-pr-title">Vani Assistive Care Pilot Registration</h1>
        <p className="vc-pr-subtitle">
          Helping individuals living with ALS, MND, and related neurodegenerative conditions 
          explore accessible communication technology.
        </p>
      </div>

      <div className="vc-pr-welcome">
        <h2>Welcome</h2>
        <p>
          Thank you for your interest in Vani Assistive Care.
        </p>
        <p>
          We are currently conducting a pilot program for individuals living with ALS, Motor Neuron Disease (MND), 
          and related neurodegenerative conditions.
        </p>
        <p>
          This pilot helps us improve accessibility, usability, reliability, and real-world effectiveness 
          while working closely with patients, caregivers, therapists, and accessibility advocates.
        </p>
        <p>
          The information below helps us understand participant needs and determine whether the current pilot 
          version is suitable.
        </p>
      </div>

      <form className="vc-pr-form" onSubmit={handleSubmit} noValidate>
        {errors.submit && <div className="vc-form-error-banner">{errors.submit}</div>}

        {/* Participant Details Section */}
        <fieldset className="vc-pr-fieldset">
          <legend className="vc-pr-legend">Participant Details</legend>
          
          <div className="vc-form-row">
            <div className="vc-field">
              <label htmlFor="fullName">
                Full Name <span className="vc-required">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Your full name"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="vc-field-error">{errors.fullName}</span>}
            </div>

            <div className="vc-field">
              <label htmlFor="email">
                Email Address <span className="vc-required">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your.email@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="vc-field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="vc-form-row">
            <div className="vc-field">
              <label htmlFor="country">
                Country <span className="vc-required">*</span>
              </label>
              <input
                id="country"
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="Country of residence"
                className={errors.country ? 'error' : ''}
              />
              {errors.country && <span className="vc-field-error">{errors.country}</span>}
            </div>

            <div className="vc-field">
              <label htmlFor="relationship">
                Relationship To Participant <span className="vc-required">*</span>
              </label>
              <select
                id="relationship"
                value={form.relationshipToParticipant}
                onChange={(e) => setForm({ ...form, relationshipToParticipant: e.target.value })}
                className={errors.relationshipToParticipant ? 'error' : ''}
              >
                <option value="">Select...</option>
                {relationshipOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.relationshipToParticipant && 
                <span className="vc-field-error">{errors.relationshipToParticipant}</span>}
            </div>
          </div>
        </fieldset>

        {/* Patient Information Section */}
        <fieldset className="vc-pr-fieldset">
          <legend className="vc-pr-legend">Patient Information</legend>
          
          <div className="vc-form-row">
            <div className="vc-field">
              <label htmlFor="condition">
                Condition <span className="vc-required">*</span>
              </label>
              <select
                id="condition"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className={errors.condition ? 'error' : ''}
              >
                <option value="">Select...</option>
                {conditionOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.condition && <span className="vc-field-error">{errors.condition}</span>}
            </div>

            <div className="vc-field">
              <label htmlFor="ageGroup">
                Age Group <span className="vc-required">*</span>
              </label>
              <select
                id="ageGroup"
                value={form.ageGroup}
                onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                className={errors.ageGroup ? 'error' : ''}
              >
                <option value="">Select...</option>
                {ageGroupOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.ageGroup && <span className="vc-field-error">{errors.ageGroup}</span>}
            </div>
          </div>
        </fieldset>

        {/* Functional Assessment Section */}
        <fieldset className="vc-pr-fieldset">
          <legend className="vc-pr-legend">Current Functional Abilities</legend>
          <p className="vc-pr-helper-text">
            This information helps us determine whether the current pilot version of Vani is suitable for the participant.
          </p>

          <div className="vc-pr-abilities-grid">
            {functionalAbilitiesOptions.map(({ key, label }) => (
              <div key={key} className="vc-pr-ability-group">
                <label className="vc-pr-ability-label">{label}</label>
                <div className="vc-pr-ability-options">
                  {abilityOptions.map(opt => (
                    <label key={opt} className="vc-pr-radio-label">
                      <input
                        type="radio"
                        name={key}
                        value={opt}
                        checked={form.functionalAbilities[key] === opt}
                        onChange={() => handleAbilityChange(key, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {errors.functionalAbilities && 
            <span className="vc-field-error">{errors.functionalAbilities}</span>}
        </fieldset>

        {/* Device Availability Section */}
        <fieldset className="vc-pr-fieldset">
          <legend className="vc-pr-legend">Available Devices</legend>
          <p className="vc-pr-helper-text">
            Select all devices available for pilot testing.
          </p>
          
          <div className="vc-pr-devices-grid">
            {deviceOptions.map(device => (
              <label key={device} className="vc-pr-checkbox-label">
                <input
                  type="checkbox"
                  checked={form.availableDevices.includes(device)}
                  onChange={() => handleDeviceToggle(device)}
                />
                <span>{device}</span>
              </label>
            ))}
          </div>
          {errors.availableDevices && 
            <span className="vc-field-error">{errors.availableDevices}</span>}
        </fieldset>

        {/* Pilot Goals Section */}
        <fieldset className="vc-pr-fieldset">
          <legend className="vc-pr-legend">How Can Vani Help?</legend>
          <div className="vc-field">
            <label htmlFor="pilotGoals">
              What would you like Vani Assistive Care to help with? <span className="vc-required">*</span>
            </label>
            <textarea
              id="pilotGoals"
              value={form.pilotGoals}
              onChange={(e) => setForm({ ...form, pilotGoals: e.target.value })}
              placeholder="e.g., Caregiver alerts, Daily communication, Emergency assistance, Accessibility support, Computer interaction, Independent communication, Other..."
              rows={5}
              className={errors.pilotGoals ? 'error' : ''}
            />
            {errors.pilotGoals && <span className="vc-field-error">{errors.pilotGoals}</span>}
          </div>
        </fieldset>

        {/* Additional Notes Section */}
        <fieldset className="vc-pr-fieldset">
          <legend className="vc-pr-legend">Additional Notes</legend>
          <div className="vc-field">
            <label htmlFor="additionalNotes">
              Anything else you would like us to know? <span className="vc-label-hint">(optional)</span>
            </label>
            <textarea
              id="additionalNotes"
              value={form.additionalNotes}
              onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
              placeholder="Any additional information..."
              rows={4}
            />
          </div>
        </fieldset>

        {/* Consent Section */}
        <fieldset className="vc-pr-fieldset">
          <legend className="vc-pr-legend">Consent</legend>
          
          <div className="vc-pr-consent-group">
            <label className="vc-pr-consent-label">
              <input
                type="checkbox"
                checked={form.consent1}
                onChange={(e) => setForm({ ...form, consent1: e.target.checked })}
              />
              <span>
                I understand that Vani Assistive Care is currently under pilot evaluation 
                and is not a certified medical device. <span className="vc-required">*</span>
              </span>
            </label>
            {errors.consent1 && <span className="vc-field-error">{errors.consent1}</span>}
          </div>

          <div className="vc-pr-consent-group">
            <label className="vc-pr-consent-label">
              <input
                type="checkbox"
                checked={form.consent2}
                onChange={(e) => setForm({ ...form, consent2: e.target.checked })}
              />
              <span>
                I voluntarily consent to participate in the pilot program and provide feedback 
                to help improve the platform. <span className="vc-required">*</span>
              </span>
            </label>
            {errors.consent2 && <span className="vc-field-error">{errors.consent2}</span>}
          </div>

          <div className="vc-pr-consent-group">
            <label className="vc-pr-consent-label">
              <input
                type="checkbox"
                checked={form.consent3}
                onChange={(e) => setForm({ ...form, consent3: e.target.checked })}
              />
              <span>
                I understand that submitting this form does not guarantee acceptance 
                into the pilot program. <span className="vc-required">*</span>
              </span>
            </label>
            {errors.consent3 && <span className="vc-field-error">{errors.consent3}</span>}
          </div>
        </fieldset>

        <div className="vc-pr-actions">
          <button 
            type="submit" 
            className="vc-btn-primary vc-pr-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PilotRegistration;
