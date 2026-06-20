import React, { useState, useRef } from 'react';

const Testing = () => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [question, setQuestion] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('upload'); // upload, analyze, results
  const fileInputRef = useRef(null);

  // Environment variables
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const API_URL = import.meta.env.VITE_GROQ_API_URL;

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      setStep('analyze');
      setError('');
    };

    reader.onerror = () => {
      setError('❌ Error reading file. Please try again.');
    };

    reader.readAsText(file);
  };

  // Clear file and reset
  const clearFile = () => {
    setFileContent('');
    setFileName('');
    setQuestion('');
    setRecommendations('');
    setStep('upload');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get recommendations from Groq API
  const getRecommendations = async () => {
    const questionText = question.trim();

    if (!fileContent) {
      setError('❌ Please upload a file first.');
      return;
    }

    if (!questionText) {
      setError('❌ Please enter a question or request.');
      return;
    }

    if (!API_KEY || !API_URL) {
      setError('❌ API credentials missing. Please check your .env file.');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are a professional recommendation system expert. Analyze the provided document and answer questions with detailed, actionable recommendations. Format your response clearly with sections and bullet points.`
            },
            {
              role: 'user',
              content: `Here is the document content:\n\n${fileContent}\n\n---\n\nQuestion or request: ${questionText}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      let result = '';

      if (data.choices && data.choices[0] && data.choices[0].message) {
        result = data.choices[0].message.content;
      } else {
        result = JSON.stringify(data, null, 2);
      }

      setRecommendations(result);
      setStep('results');
    } catch (err) {
      console.error('API Error:', err);
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      color: '#1a202c'
    },
    title: {
      fontSize: '36px',
      fontWeight: '700',
      margin: '0 0 10px 0',
      color: '#2d3748'
    },
    subtitle: {
      fontSize: '16px',
      color: '#718096',
      margin: 0
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    section: {
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#2d3748'
    },
    fileUploadArea: {
      border: '2px dashed #cbd5e0',
      borderRadius: '8px',
      padding: '30px',
      textAlign: 'center',
      backgroundColor: '#f7fafc',
      transition: 'all 0.3s ease',
      marginBottom: '15px',
      cursor: 'pointer'
    },
    fileInput: {
      display: 'none'
    },
    fileLabel: {
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#4299e1',
      color: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      marginBottom: '10px',
      transition: 'background-color 0.2s'
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '12px',
      backgroundColor: '#e6fffa',
      borderRadius: '6px',
      marginTop: '10px',
      color: '#234e52'
    },
    clearButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#e53e3e',
      padding: 0
    },
    fileHint: {
      fontSize: '13px',
      color: '#718096',
      margin: '10px 0 0 0'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #cbd5e0',
      fontSize: '14px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      boxSizing: 'border-box',
      resize: 'vertical'
    },
    questionInput: {
      width: '100%',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #cbd5e0',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginRight: '10px'
    },
    primaryButton: {
      backgroundColor: '#48bb78',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#cbd5e0',
      color: '#2d3748'
    },
    dangerButton: {
      backgroundColor: '#f56565',
      color: 'white'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    },
    error: {
      backgroundColor: '#fed7d7',
      color: '#c53030',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '20px',
      border: '1px solid #fc8181'
    },
    success: {
      backgroundColor: '#c6f6d5',
      color: '#22543d',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '20px',
      border: '1px solid #9ae6b4'
    },
    resultsBox: {
      backgroundColor: '#f7fafc',
      border: '1px solid #cbd5e0',
      borderRadius: '8px',
      padding: '20px',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      fontSize: '14px',
      lineHeight: '1.6',
      maxHeight: '600px',
      overflowY: 'auto',
      color: '#2d3748'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#718096'
    },
    spinner: {
      display: 'inline-block',
      width: '40px',
      height: '40px',
      border: '4px solid #cbd5e0',
      borderTop: '4px solid #4299e1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '30px',
      position: 'relative'
    },
    stepItem: {
      textAlign: 'center',
      flex: 1
    },
    stepNumber: {
      display: 'inline-block',
      width: '40px',
      height: '40px',
      lineHeight: '40px',
      borderRadius: '50%',
      backgroundColor: '#cbd5e0',
      color: 'white',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    stepText: {
      fontSize: '13px',
      color: '#718096'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={styles.header}>
        <h1 style={styles.title}>📊 Professional Recommendation System</h1>
        <p style={styles.subtitle}>Upload a file and get intelligent recommendations powered by Groq AI</p>
      </div>

      <div style={styles.card}>
        {/* Step Indicator */}
        <div style={styles.stepIndicator}>
          <div style={styles.stepItem}>
            <div style={{...styles.stepNumber, backgroundColor: step === 'upload' || step === 'analyze' || step === 'results' ? '#4299e1' : '#cbd5e0'}}>1</div>
            <div style={styles.stepText}>Upload File</div>
          </div>
          <div style={styles.stepItem}>
            <div style={{...styles.stepNumber, backgroundColor: step === 'analyze' || step === 'results' ? '#4299e1' : '#cbd5e0'}}>2</div>
            <div style={styles.stepText}>Ask Question</div>
          </div>
          <div style={styles.stepItem}>
            <div style={{...styles.stepNumber, backgroundColor: step === 'results' ? '#4299e1' : '#cbd5e0'}}>3</div>
            <div style={styles.stepText}>View Results</div>
          </div>
        </div>

        {/* Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Step 1: Upload File */}
        {step === 'upload' && (
          <div style={styles.section}>
            <label style={styles.label}>📁 Upload Your File</label>
            <div style={styles.fileUploadArea}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.csv,.json,.js,.jsx,.html,.css,.xml,.pdf"
                style={styles.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={styles.fileLabel}>
                Choose File
              </label>
              <p style={styles.fileHint}>Supported formats: .txt, .md, .csv, .json, .js, .jsx, .html, .css, .xml, .pdf</p>
            </div>
          </div>
        )}

        {/* Step 2: Ask Question */}
        {step === 'analyze' && (
          <div>
            <div style={styles.section}>
              <label style={styles.label}>✅ File Loaded</label>
              <div style={styles.fileInfo}>
                <span>📄 {fileName}</span>
                <span style={{fontSize: '12px', color: '#718096'}}>({fileContent.length} characters)</span>
              </div>
            </div>

            <div style={styles.section}>
              <label style={styles.label}>❓ Ask Your Question or Request</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Examples:&#10;• Provide recommendations for improving this content&#10;• Summarize the key points&#10;• Identify potential issues and suggest fixes&#10;• What are the main topics covered?"
                style={{...styles.textarea, height: '120px'}}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                onClick={getRecommendations}
                disabled={loading}
                style={{...styles.button, ...styles.primaryButton, opacity: loading ? 0.6 : 1}}
              >
                {loading ? '🔄 Analyzing...' : '🚀 Get Recommendations'}
              </button>
              <button
                onClick={clearFile}
                style={{...styles.button, ...styles.secondaryButton}}
              >
                ← Upload Different File
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 'results' && (
          <div>
            {loading ? (
              <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Analyzing your document...</p>
              </div>
            ) : (
              <div>
                <div style={{...styles.section, ...styles.success}}>
                  ✅ Recommendations Generated
                </div>

                <div style={styles.section}>
                  <label style={styles.label}>📋 Results</label>
                  <div style={styles.resultsBox}>
                    {recommendations}
                  </div>
                </div>

                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => {
                      setQuestion('');
                      setStep('analyze');
                    }}
                    style={{...styles.button, ...styles.primaryButton}}
                  >
                    ❓ Ask Another Question
                  </button>
                  <button
                    onClick={clearFile}
                    style={{...styles.button, ...styles.secondaryButton}}
                  >
                    📁 Upload New File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testing;
