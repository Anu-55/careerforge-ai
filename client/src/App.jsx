import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewPage from './pages/InterviewPage';
import FeedbackPage from './pages/FeedbackPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <div className="app-shell">

      <Routes>

        {/* ================================
            LOGIN
        ================================= */}
        <Route
          path="/login"
          element={<LoginPage />}
        />


        {/* ================================
            DASHBOARD
            SIDEBAR ONLY HERE
        ================================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <HomePage />
              </>
            </ProtectedRoute>
          }
        />


        {/* ================================
            START INTERVIEW
            NO SIDEBAR
        ================================= */}
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <InterviewSetupPage />
            </ProtectedRoute>
          }
        />


        {/* ================================
            INTERVIEW
            NO SIDEBAR
        ================================= */}
        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          }
        />


        {/* ================================
            FEEDBACK
            NO SIDEBAR
        ================================= */}
        <Route
          path="/feedback/:id"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />


        {/* ================================
            HISTORY
            NO SIDEBAR
        ================================= */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />


        {/* ================================
            UNKNOWN URL
        ================================= */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </div>
  );
}

export default App;