import React from 'react';

function BasicInfoStep({ data, onChange }) {
  return (
    <section className="step-panel fade-in">
      <p className="step-kicker">Step 1 of 4 - Just getting started!</p>
      <h2>Basic Info - Tell Us About Yourself</h2>
      <p className="step-description">
        Basic information helps us personalize your career guidance.
      </p>

      <div className="form-grid two-columns">
        <label className="field full">
          <span>Enter Your Name</span>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChange}
            placeholder="Enter your full name"
          />
        </label>

        <label className="field">
          <span>Your Age</span>
          <input
            type="number"
            name="age"
            min="10"
            max="100"
            value={data.age}
            onChange={onChange}
            placeholder="Enter your age (e.g. 16)"
          />
        </label>

        <div className="field">
          <span>Gender</span>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={data.gender === 'Male'}
                onChange={onChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={data.gender === 'Female'}
                onChange={onChange}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={data.gender === 'Other'}
                onChange={onChange}
              />
              Other
            </label>
          </div>
        </div>

        <label className="field full">
          <span>Your Class</span>
          <select
            name="classLevel"
            value={data.classLevel}
            onChange={onChange}
          >
            <option value="">Select class from 1 to 10</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
             <option value="Middle School">Middle School</option>
            <option value="Matric">Matric</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Masters">Masters</option>
            <option value="Other">Other</option>
          </select>
        </label>
      </div>
    </section>
  );
}

export default BasicInfoStep;
