import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Website from './components/website.jsx';
import AssessmentWizard from './components/AssessmentWizard.jsx';
import HistoryPage from './components/HistoryPage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Website />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/assessment" element={
        <ProtectedRoute>
          <AssessmentWizard />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <HistoryPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
