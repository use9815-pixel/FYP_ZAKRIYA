import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import BasicInfoStep from './BasicInfoStep.jsx';
import InterestsStep from './InterestsStep.jsx';
import HabitsStep from './HabitsStep.jsx';
import MarksheetStep from './MarksheetStep.jsx';
import ResultsStep from './ResultsStep.jsx';

const API_BASE_URLS = [
  import.meta.env.VITE_BACKEND_API_URL,
  import.meta.env.DEV ? 'http://localhost:5000/api' : null,
  import.meta.env.DEV ? 'http://localhost:5001/api' : null,
  !import.meta.env.DEV && typeof window !== 'undefined' ? `${window.location.origin}/api` : null,
  'https://fyp-project-123.vercel.app/api'
].filter(Boolean);
const STEP_LABELS = ['Basic Info', 'Interests', 'Habits', 'Marksheet', 'Results'];
const MAX_INTERESTS = 5;

const DEFAULT_FORM = {
  name: '',
  age: '',
  gender: '',
  classLevel: '',
  interests: [],
  habits: [],
  habitDescription: '',
  marksheetFile: null
};

const CAREER_LIBRARY = {
  'Science & Research': {
    paths: ['Research Scientist', 'Lab Analyst', 'Data Scientist'],
    strengths: ['Analytical thinking', 'Problem solving', 'Experiment design'],
    courses: ['BS/MS in Biology', 'Chemistry', 'Data Science'],
    universities: ['University science departments', 'STEM institutes', 'Research labs']
  },
  'Technology & IT': {
    paths: ['Software Developer', 'IT Support Specialist', 'Cybersecurity Analyst'],
    strengths: ['Logic', 'Systems thinking', 'Technical troubleshooting'],
    courses: ['Computer Science', 'Information Technology', 'Software Engineering'],
    universities: ['Computing schools', 'IT academies', 'Technical universities']
  },
  'Business & Finance': {
    paths: ['Business Analyst', 'Financial Analyst', 'Management Trainee'],
    strengths: ['Communication', 'Decision making', 'Leadership'],
    courses: ['BBA', 'MBA', 'Finance', 'Accounting'],
    universities: ['Business schools', 'Commerce colleges', 'Management institutes']
  },
  'Medicine & Health': {
    paths: ['Doctor', 'Pharmacist', 'Health Administrator'],
    strengths: ['Care orientation', 'Accuracy', 'Responsibility'],
    courses: ['MBBS', 'Nursing', 'Pharmacy', 'Public Health'],
    universities: ['Medical universities', 'Health sciences colleges', 'Nursing schools']
  },
  Engineering: {
    paths: ['Engineer', 'Project Coordinator', 'Technical Consultant'],
    strengths: ['Structured thinking', 'Design', 'Math aptitude'],
    courses: ['Civil', 'Mechanical', 'Electrical', 'Software Engineering'],
    universities: ['Engineering universities', 'Polytechnic institutes', 'Technical campuses']
  },
  'Education & Teaching': {
    paths: ['Teacher', 'Academic Counselor', 'Trainer'],
    strengths: ['Patience', 'Empathy', 'Explaining concepts'],
    courses: ['Education', 'Psychology', 'Subject specialization'],
    universities: ['Education colleges', 'Teacher training institutes', 'Liberal arts universities']
  },
  'Law & Politics': {
    paths: ['Lawyer', 'Legal Advisor', 'Policy Analyst'],
    strengths: ['Argumentation', 'Writing', 'Critical reading'],
    courses: ['LLB', 'Political Science', 'Public Policy'],
    universities: ['Law schools', 'Public policy institutes', 'Humanities universities']
  },
  'Media & Communication': {
    paths: ['Journalist', 'Content Strategist', 'Public Relations Officer'],
    strengths: ['Storytelling', 'Presentation', 'Audience awareness'],
    courses: ['Mass Communication', 'Media Studies', 'Digital Marketing'],
    universities: ['Media colleges', 'Communications departments', 'Creative institutes']
  },
  'Animals & Veterinary': {
    paths: ['Veterinarian', 'Animal Care Specialist', 'Pet Clinic Assistant'],
    strengths: ['Compassion', 'Observation', 'Service mindset'],
    courses: ['Veterinary Science', 'Animal Health', 'Biology'],
    universities: ['Veterinary universities', 'Animal science schools', 'Life science campuses']
  },
  Agriculture: {
    paths: ['Agronomist', 'Farm Manager', 'Agriculture Officer'],
    strengths: ['Fieldwork', 'Planning', 'Sustainability focus'],
    courses: ['Agriculture', 'Agronomy', 'Food Technology'],
    universities: ['Agricultural universities', 'Rural development institutes', 'Life science colleges']
  }
};

const WEAKNESS_LIBRARY = {
  'Science & Research': ['May prefer theory over social collaboration', 'Can be less comfortable with spontaneous presentation work'],
  'Technology & IT': ['May avoid creative writing or people-facing work', 'Can need stronger patience for slow-moving projects'],
  'Business & Finance': ['May be less drawn to deep technical subjects', 'Can feel pressured by highly structured routines'],
  'Medicine & Health': ['Can find irregular schedules stressful', 'May need to maintain focus under pressure'],
  Engineering: ['May dislike routine paperwork', 'Can need more patience for detailed project planning'],
  'Education & Teaching': ['May feel drained by strict administrative processes', 'Can be challenged by rapid technical change'],
  'Law & Politics': ['May need stronger patience for lengthy research', 'Can find highly technical roles less appealing'],
  'Media & Communication': ['May struggle with repetitive analysis tasks', 'Can need more consistency under tight deadlines'],
  'Animals & Veterinary': ['May experience emotional strain from care work', 'Can prefer smaller-scale environments to corporate settings'],
  Agriculture: ['Can find urban office environments difficult', 'May need higher resilience for outdoors work in all weather']
};

function dedupe(items) {
  return [...new Set(items.filter(Boolean))];
}

function normalizeApiBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, '');
}

function isRetryableApiError(error) {
  return !error.response || error.response.status === 404;
}

function getReadableApiError(error) {
  const status = error.response?.status;
  const responseError = error.response?.data?.error;

  if (status === 404) {
    return 'Backend endpoint not found. Your Vercel backend currently responds on /api, but /api/upload and /api/ask are not deployed yet.';
  }

  if (!error.response) {
    return 'Cannot reach backend server. Make sure your backend is running and reachable from this app.';
  }

  return responseError || error.message;
}

async function postWithApiFallbacks(path, body, config) {
  let lastError = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      return await axios.post(`${normalizeApiBaseUrl(baseUrl)}${path}`, body, config);
    } catch (error) {
      lastError = error;

      if (!isRetryableApiError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

function buildQuestions(formData) {
  return [
    'Generate a professional Career Guidance Report based on the candidate profile and uploaded marksheet.',
    `Student Profile: Name ${formData.name || 'Not provided'}, Age ${formData.age || 'Not provided'}, Gender ${formData.gender || 'Not provided'}, Class ${formData.classLevel || 'Not provided'}`,
    `Interests: ${formData.interests.length > 0 ? formData.interests.join(', ') : 'Not provided'}`,
    `Habits: ${formData.habits.length > 0 ? formData.habits.join(', ') : 'Not provided'}`,
    `Daily Description: ${formData.habitDescription || 'Not provided'}`,
    '',
    'Return the result with exactly these headings:',
    '1. Top 3 Career Paths',
    '2. Your Strongest Areas',
    '3. Recommended Courses/Degrees',
    '4. Skills to Develop',
    'Short Term (Next 3-6 Months)',
    'Medium Term (6-12 Months)',
    'Long Term (1-3 Years)',
    '5. Universities/Institutions',
    '6. Strong Subjects from Marksheet',
    '7. Final Career Advice',
    '8. Strong Subject',
    '9. Weak Subject'
  ].join('\n');
}

function saveReportToHistory(newReport) {
  const key = 'careerGuideReports';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const item = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    report: newReport
  };
  localStorage.setItem(key, JSON.stringify([item, ...existing].slice(0, 20)));
}

function AssessmentWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return formData.name && formData.age && formData.gender && formData.classLevel;
    }
    if (step === 1) {
      return formData.interests.length > 0;
    }
    if (step === 2) {
      return formData.habits.length > 0 || formData.habitDescription.trim().length > 0;
    }
    if (step === 3) {
      return Boolean(formData.marksheetFile);
    }
    return true;
  }, [formData, step]);

  const handleBasicInfoChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleToggleInterest = (interest) => {
    setFormData((previous) => {
      const alreadySelected = previous.interests.includes(interest);
      if (alreadySelected) {
        return {
          ...previous,
          interests: previous.interests.filter((item) => item !== interest)
        };
      }

      if (previous.interests.length >= MAX_INTERESTS) {
        setError(`You can select up to ${MAX_INTERESTS} interests.`);
        return previous;
      }

      setError('');
      return {
        ...previous,
        interests: [...previous.interests, interest]
      };
    });
  };

  const handleToggleHabit = (habit) => {
    setFormData((previous) => ({
      ...previous,
      habits: previous.habits.includes(habit)
        ? previous.habits.filter((item) => item !== habit)
        : [...previous.habits, habit]
    }));
  };

  const handleMarksheetFile = (file) => {
    setFormData((previous) => ({ ...previous, marksheetFile: file }));
    setError('');
  };

  const buildReportFromApi = async () => {
    if (!formData.marksheetFile) {
      setError('Please upload your marksheet before continuing.');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', formData.marksheetFile);

      const uploadResponse = await postWithApiFallbacks('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const question = buildQuestions(formData);
      const askResponse = await postWithApiFallbacks('/ask', {
        question,
        documentText: uploadResponse.data.documentText
      });

      const matchedInterestProfiles = formData.interests
        .map((interest) => CAREER_LIBRARY[interest])
        .filter(Boolean);

      const topCareerPaths = dedupe([
        ...matchedInterestProfiles.flatMap((item) => item.paths),
        'Management Trainee',
        'Business Analyst'
      ]).slice(0, 3);

      const strongestAreas = dedupe([
        ...matchedInterestProfiles.flatMap((item) => item.strengths),
        ...(formData.habits.includes('I prefer working in teams') ? ['Team collaboration'] : []),
        ...(formData.habits.includes('I enjoy both') ? ['Adaptability'] : []),
        ...(formData.habitDescription ? [formData.habitDescription] : [])
      ]).slice(0, 5);

      const recommendedCourses = dedupe([
        ...matchedInterestProfiles.flatMap((item) => item.courses),
        'Career counseling workshops',
        'Interview preparation program'
      ]).slice(0, 5);

      const universities = dedupe([
        ...matchedInterestProfiles.flatMap((item) => item.universities),
        'Local top-ranked universities',
        'Professional training institutes'
      ]).slice(0, 5);

      const strongSubjects = dedupe([
        uploadResponse.data.preview || uploadResponse.data.fileName || 'Marksheet uploaded successfully',
        formData.interests[0] || 'General academic strength'
      ]).slice(0, 6);

      const weakPoints = dedupe([
        ...formData.interests.flatMap((interest) => WEAKNESS_LIBRARY[interest] || []),
        ...(formData.habits.includes('I prefer working alone') ? ['May need to improve teamwork and collaboration skills'] : []),
        ...(formData.habits.includes('I prefer working in teams') ? ['May benefit from stronger independent focus'] : []),
        ...(formData.habits.includes('I enjoy both') ? ['Needs a clearer focus to choose the best career path'] : [])
      ]).slice(0, 5);

      const finalReport = {
        generatedAt: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        profile: {
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          classLevel: formData.classLevel,
          interests: formData.interests,
          habits: formData.habits,
          habitDescription: formData.habitDescription
        },
        overallScore: uploadResponse.data.length ? `CGPA: ${(Math.min(4, Math.max(2, uploadResponse.data.length / 1000 + 2))).toFixed(2)}` : 'Not detected',
        topCareerPaths,
        strongestAreas,
        recommendedCourses,
        skills: {
          shortTerm: ['Improve communication', 'Practice basic aptitude tests', 'Learn Excel and presentation basics'],
          mediumTerm: ['Take subject-based certification', 'Work on projects or internships', 'Build interview confidence'],
          longTerm: ['Develop leadership experience', 'Specialize in a career track', 'Prepare for advanced studies or professional roles']
        },
        universities,
        strongSubjects,
        weakPoints,
        rawText: askResponse.data.answer
      };

      setReport(finalReport);
      saveReportToHistory(finalReport);
      setStep(4);
    } catch (apiError) {
      const triedBases = API_BASE_URLS.join(', ');
      setError(`API request failed: ${getReadableApiError(apiError)} Tried: ${triedBases}`);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (step < 3) {
      if (!canContinue) {
        if (step === 0) {
          setError('Please enter your name, age, gender, and class.');
        } else if (step === 1) {
          setError('Please select at least one interest.');
        } else if (step === 2) {
          setError('Please select a habit chip or write a short description.');
        }
        return;
      }
      setError('');
      setStep((previous) => previous + 1);
      return;
    }

    await buildReportFromApi();
  };

  const previousStep = () => {
    setError('');
    setStep((previous) => Math.max(0, previous - 1));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-top">
          <h1>CareerGuide AI</h1>
          <div className="header-links">
            <Link to="/" className="button ghost">Website</Link>
            <Link to="/history" className="button ghost">History</Link>
            <button className="button danger" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
          </div>
        </div>
        <p>Smart career counselor for personalized guidance, marksheet analysis, and professional recommendations.</p>
        <div style={{ marginTop: 14 }}>
          <div className="progress-wrap" aria-hidden>
            <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>
        <nav className="stepper" aria-label="Progress">
          {STEP_LABELS.map((label, index) => (
            <div key={label} className={`stepper-item ${step === index ? 'active' : ''}`}>
              {index + 1}. {label}
            </div>
          ))}
        </nav>
      </header>

      <main className="main-card">
        {step === 0 && <BasicInfoStep data={formData} onChange={handleBasicInfoChange} />}
        {step === 1 && <InterestsStep selectedInterests={formData.interests} onToggle={handleToggleInterest} />}
        {step === 2 && (
          <HabitsStep
            selectedHabits={formData.habits}
            habitDescription={formData.habitDescription}
            onToggleHabit={handleToggleHabit}
            onDescriptionChange={(value) => setFormData((previous) => ({ ...previous, habitDescription: value }))}
          />
        )}
        {step === 3 && <MarksheetStep file={formData.marksheetFile} onFileChange={handleMarksheetFile} />}
        {step === 4 && <ResultsStep report={report} />}

        {loading && <div className="status loading">Analyzing your profile and marksheet with the API...</div>}
        {error && <div className="status error">{error}</div>}

        {step < 4 && (
          <div className="nav-bar">
            <button type="button" className="button ghost" onClick={previousStep} disabled={step === 0 || loading}>
              Back
            </button>
            <button type="button" className="button primary" onClick={nextStep} disabled={loading}>
              {step === 3 ? 'Get Career Guidance' : 'Continue'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="nav-bar">
            <button
              type="button"
              className="button ghost"
              onClick={() => {
                setStep(0);
                setReport(null);
                setError('');
                setFormData(DEFAULT_FORM);
              }}
              disabled={loading}
            >
              Start Over
            </button>
            <button
              type="button"
              className="button primary"
              onClick={() => {
                setStep(3);
                setReport(null);
              }}
              disabled={loading}
            >
              Upload Different Marksheet
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default AssessmentWizard;
