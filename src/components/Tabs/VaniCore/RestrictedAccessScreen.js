// src/components/Tabs/VaniCore/RestrictedAccessScreen.js
import React from 'react';

const RestrictedAccessScreen = ({ onNavigateToPilot }) => {
  return (
    <section className="vc-section vc-restricted-access">
      <div className="vc-restricted-overlay">
        <div className="vc-restricted-content">
          <div className="vc-restricted-icon">🔒</div>
          <h2 className="vc-restricted-title">Pilot Access Required</h2>
          <p className="vc-restricted-message">
            Thank you for your interest in Vani Assistive Care.
          </p>
          <p className="vc-restricted-details">
            The setup guide, onboarding materials, and software downloads are currently available 
            only to approved pilot participants.
          </p>
          
          <div className="vc-restricted-section">
            <h3 className="vc-restricted-section-title">To request access:</h3>
            <ol className="vc-restricted-steps">
              <li>Complete the Pilot Registration form</li>
              <li>Contact us at: <a href="mailto:vaaninnovations@gmail.com">vaaninnovations@gmail.com</a></li>
            </ol>
            <p className="vc-restricted-footer">
              I will review your registration and reach out regarding the next steps.
            </p>
          </div>

          <button 
            className="vc-btn-primary vc-restricted-btn"
            onClick={onNavigateToPilot}
            aria-label="Go to Pilot Registration"
          >
            Go To Pilot Registration
          </button>
        </div>
      </div>
    </section>
  );
};

export default RestrictedAccessScreen;
