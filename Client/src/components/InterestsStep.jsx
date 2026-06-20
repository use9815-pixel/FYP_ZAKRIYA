import React from 'react';

const INTEREST_OPTIONS = [
  'Science & Research',
  'Technology & IT',
  'Arts & Design',
  'Business & Finance',
  'Medicine & Health',
  'Engineering',
  'Law & Politics',
  'Education & Teaching',
  'Sports & Fitness',
  'Media & Communication',
  'Agriculture',
  'Social Work',
  'Military & Defense',
  'Music & Entertainment',
  'Fashion & Beauty',
  'Travel & Tourism',
  'Animals & Veterinary',
  'Cooking & Culinary'
];

function InterestsStep({ selectedInterests, onToggle }) {
  return (
    <section className="step-panel fade-in">
      <p className="step-kicker">Step 2 of 4</p>
      <h2>Interests - What Excites You?</h2>
      <p className="step-description">Select up to 5 areas that interest you most.</p>
      <p className="selection-count">{selectedInterests.length} / 5 selected</p>

      <div className="chips-grid">
        {INTEREST_OPTIONS.map((interest) => {
          const active = selectedInterests.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              className={`chip interest-chip ${active ? 'active' : ''}`}
              onClick={() => onToggle(interest)}
            >
              {active ? 'Selected: ' : ''}
              {interest}
            </button>
          );
        })}
      </div>

      <div className="selected-box slide-up">
        <strong>Your selections:</strong>
        {selectedInterests.length === 0 ? (
          <p>No interests selected yet.</p>
        ) : (
          <ul>
            {selectedInterests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default InterestsStep;
