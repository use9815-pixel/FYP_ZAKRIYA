import React from 'react';

const HABIT_CHIPS = {
  'Study Hours': [
    'I study 1-2 hrs/day',
    'I study 3-4 hrs/day',
    'I study 5+ hrs/day',
    'I rarely study at home'
  ],
  'Work Style': [
    'I prefer working alone',
    'I prefer working in teams',
    'I enjoy both'
  ],
  'Free Time': [
    'I play sports',
    'I read books',
    'I watch videos/docs',
    'I play video games',
    'I do art/music',
    'I cook or travel'
  ],
  Personality: [
    "I'm a morning person",
    "I'm a night owl",
    'I love helping others',
    "I'm creative & artistic",
    "I'm analytical & logical"
  ]
};

function HabitsStep({ selectedHabits, habitDescription, onToggleHabit, onDescriptionChange }) {
  return (
    <section className="step-panel fade-in">
      <p className="step-kicker">Step 3 of 4</p>
      <h2>Your Daily Habits</h2>
      <p className="step-description">Tap the chips below or write your own description.</p>

      {Object.entries(HABIT_CHIPS).map(([group, values]) => (
        <div key={group} className="habit-group slide-up">
          <h3>{group}</h3>
          <div className="chips-row">
            {values.map((value) => {
              const active = selectedHabits.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  className={`chip ${active ? 'active' : ''}`}
                  onClick={() => onToggleHabit(value)}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <label className="field">
        <span>Or describe in your own words</span>
        <textarea
          value={habitDescription}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="e.g. I study 3-4 hours daily, prefer teamwork, love cricket and documentaries..."
        />
      </label>
      <p className="char-count">{habitDescription.length} characters</p>
    </section>
  );
}

export default HabitsStep;
