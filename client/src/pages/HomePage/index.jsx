import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getHistory, deleteHistoryItem } from '../../services/historyService.js';
import { getPerformance } from '../../services/performanceService.js';
import InterviewCard from '../../components/InterviewCard';

import {
  BsChatSquareTextFill,
  BsCheckCircleFill,
  BsTrophyFill,
  BsPlayCircleFill,
  BsChatSquareText,
  BsStars,
} from 'react-icons/bs';
import toast from 'react-hot-toast';
import './index.css';

function HomePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [recentInterviews, setRecentInterviews] = useState([]);
  const [allInterviews, setAllInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
  const loadHistory = async () => {
    try {
      const allData = await getHistory(1, 100);

      setAllInterviews(allData.entries);
      setRecentInterviews(allData.entries.slice(0, 3));
    } catch (error) {
      console.error('Failed to load history:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPerformance = async () => {
    try {
      const data = await getPerformance();
      setPerformance(data);
    } catch (error) {
      console.error('Failed to load performance:', error.message);
    }
  };

  loadHistory();
  loadPerformance();
}, []);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);

      setAllInterviews((prev) => {
        const updated = prev.filter((item) => item._id !== id);
        setRecentInterviews(updated.slice(0, 3));
        return updated;
      });

      toast.success('Interview deleted');
    } catch (error) {
      toast.error('Failed to delete interview');
    }
  };

  const handleCardClick = (interview) => {
    if (interview.status === 'completed') {
      navigate(`/feedback/${interview._id}`);
    } else {
      navigate(`/interview/${interview._id}`);
    }
  };

  const completedCount = allInterviews.filter(
    (i) => i.status === 'completed'
  ).length;

  const scoredInterviews = allInterviews.filter(
    (i) => i.overallScore
  );

  const avgScore =
    scoredInterviews.length > 0
      ? Math.round(
          scoredInterviews.reduce(
            (sum, i) => sum + i.overallScore,
            0
          ) / scoredInterviews.length
        )
      : 0;

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="home-page">

      {/* ================================
          WELCOME SECTION
      ================================= */}

      <section className="home-hero">

  <div className="home-hero-content">

    <p className="home-hero-welcome">
      Welcome back, {firstName}! 👋
    </p>

    <h1>
      Sharpen Your Skills,
      <br />
      Build Your Future
    </h1>

    <p className="home-hero-description">
      Practice with AI, get instant feedback, and become
      <br />
      more confident in your next interview.
    </p>

    <button
      className="home-hero-button"
      onClick={() => navigate('/setup')}
    >
      <BsPlayCircleFill />
      <span>Start New Interview</span>
      <span className="home-hero-arrow">→</span>
    </button>

  </div>

  <div className="home-hero-image">
    <img
      src="/hero-girl.png"
      alt="AI interview coach"
    />
  </div>

</section>

      {/* ================================
          PERFORMANCE STATS
      ================================= */}

      <section className="home-stats-row">

        <div className="home-stat-card">

          <div className="home-stat-card-top">

            <div className="home-stat-icon-box">
              <BsChatSquareTextFill className="home-stat-icon" />
            </div>

            <span className="home-stat-label">
              Total Interviews
            </span>

          </div>

          <span className="home-stat-number">
            {allInterviews.length}
          </span>

          <span className="home-stat-description">
            Practice sessions
          </span>

        </div>


        <div className="home-stat-card">

          <div className="home-stat-card-top">

            <div className="home-stat-icon-box">
              <BsCheckCircleFill className="home-stat-icon" />
            </div>

            <span className="home-stat-label">
              Completed
            </span>

          </div>

          <span className="home-stat-number">
            {completedCount}
          </span>

          <span className="home-stat-description">
            Finished interviews
          </span>

        </div>


        <div className="home-stat-card">

          <div className="home-stat-card-top">

            <div className="home-stat-icon-box">
              <BsTrophyFill className="home-stat-icon" />
            </div>

            <span className="home-stat-label">
              Average Score
            </span>

          </div>

          <span className="home-stat-number">
            {avgScore}
          </span>

          <span className="home-stat-description">
            Overall performance
          </span>

        </div>

      </section>
      {/* ================================
    AI PERFORMANCE OVERVIEW
================================ */}

{performance?.hasData && (
  <section className="home-performance-section">

    <div className="home-performance-header">

      <div>
        <div className="home-performance-eyebrow">
          <BsStars />
          AI Performance Insights
        </div>

        <h2 className="home-performance-heading">
          Your Interview Readiness
        </h2>

        <p className="home-performance-subtitle">
          See how your interview skills are developing over time.
        </p>
      </div>

      <div className="home-readiness-score">
        <span className="home-readiness-number">
          {performance.readinessScore}
        </span>

        <span className="home-readiness-label">
          /100
        </span>
      </div>

    </div>

    <div className="home-performance-insights">

      <div className="home-insight-card">
        <span className="home-insight-label">
          Strongest Skill
        </span>

        <strong>
  {performance.strongestSkill?.name === 'communicationSkills'
    ? 'Communication Skills'
    : performance.strongestSkill?.name === 'technicalKnowledge'
    ? 'Technical Knowledge'
    : performance.strongestSkill?.name === 'problemSolving'
    ? 'Problem Solving'
    : performance.strongestSkill?.name === 'codeQuality'
    ? 'Code Quality'
    : performance.strongestSkill?.name === 'confidence'
    ? 'Confidence'
    : performance.strongestSkill?.name}
</strong>

        <span>
          {performance.strongestSkill?.score}/100
        </span>
      </div>


      <div className="home-insight-card">
        <span className="home-insight-label">
          Focus Area
        </span>

        <strong>
  {performance.improvementArea?.name === 'communicationSkills'
    ? 'Communication Skills'
    : performance.improvementArea?.name === 'technicalKnowledge'
    ? 'Technical Knowledge'
    : performance.improvementArea?.name === 'problemSolving'
    ? 'Problem Solving'
    : performance.improvementArea?.name === 'codeQuality'
    ? 'Code Quality'
    : performance.improvementArea?.name === 'confidence'
    ? 'Confidence'
    : performance.improvementArea?.name}
</strong>

        <span>
          {performance.improvementArea?.score}/100
        </span>
      </div>


      <div className="home-insight-card">
        <span className="home-insight-label">
          Recent Trend
        </span>

        <strong>
          {performance.recentTrend > 0
            ? `+${performance.recentTrend}`
            : performance.recentTrend}
        </strong>

        <span>
          vs previous interview
        </span>
      </div>

    </div>

  </section>
)}


      {/* ================================
          RECENT INTERVIEWS
      ================================= */}

      <section className="home-recent-section">

        <div className="home-section-header">

          <div>
            <h2 className="home-section-heading">
              Recent Interviews
            </h2>

            <p className="home-section-subtitle">
              Review your latest AI interview sessions
            </p>
          </div>

          {recentInterviews.length > 0 && (
            <button
              className="home-view-all-btn"
              onClick={() => navigate('/history')}
            >
              View All
            </button>
          )}

        </div>


        {/* Loading */}

        {loading && (
          <div className="home-loading-state">

            <div
              className="spinner-border"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="home-loading-text">
              Loading your interviews...
            </p>

          </div>
        )}


        {/* Empty */}

        {!loading && recentInterviews.length === 0 && (
          <div className="home-empty-state">

            <BsChatSquareText className="home-empty-icon" />

            <h3 className="home-empty-heading">
              Your interview journey starts here
            </h3>

            <p className="home-empty-text">
              Complete your first AI mock interview and
              start building your interview confidence.
            </p>

            <button
              className="home-empty-cta-btn"
              onClick={() => navigate('/setup')}
            >
              <BsPlayCircleFill />
              Start Your First Interview
            </button>

          </div>
        )}


        {/* Interview Cards */}

        {!loading && recentInterviews.length > 0 && (
          <div className="home-interviews-grid">

            {recentInterviews.map((interview) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                onClick={() => handleCardClick(interview)}
                onDelete={handleDelete}
              />
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default HomePage;