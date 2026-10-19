import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
  getHistory,
  deleteHistoryItem,
} from '../../services/historyService.js';
import { getPerformance } from '../../services/performanceService.js';
import InterviewCard from '../../components/InterviewCard';

import {
  BsChatSquareTextFill,
  BsCheckCircleFill,
  BsTrophyFill,
  BsPlayCircleFill,
  BsChatSquareText,
  BsStars,
  BsArrowRight,
  BsLightningChargeFill,
  BsBullseye,
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
    (interview) => interview.status === 'completed'
  ).length;

  const scoredInterviews = allInterviews.filter(
    (interview) => interview.overallScore
  );

  const avgScore =
    scoredInterviews.length > 0
      ? Math.round(
          scoredInterviews.reduce(
            (sum, interview) => sum + interview.overallScore,
            0
          ) / scoredInterviews.length
        )
      : 0;

  const firstName = user?.name?.split(' ')[0] || 'there';

  const getSkillName = (name) => {
    const skillNames = {
      communicationSkills: 'Communication Skills',
      technicalKnowledge: 'Technical Knowledge',
      problemSolving: 'Problem Solving',
      codeQuality: 'Code Quality',
      confidence: 'Confidence',
    };

    return skillNames[name] || name || 'Not available';
  };

  return (
    <div className="home-page">

      {/* ==========================================
          HERO / WELCOME
      ========================================== */}

      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-hero-badge">
            <BsStars />
            AI Interview Coach
          </div>

          <p className="home-hero-welcome">
            Welcome back, {firstName}! 👋
          </p>

          <h1 className="home-hero-title">
            Sharpen Your Skills,
            <br />
            <span>Build Your Future.</span>
          </h1>

          <p className="home-hero-description">
            Practice with AI, receive personalized feedback,
            <br />
            and become more confident for your next interview.
          </p>

          <button
            className="home-hero-button"
            onClick={() => navigate('/setup')}
          >
            <BsPlayCircleFill />

            <span>Start New Interview</span>

            <BsArrowRight className="home-hero-arrow" />
          </button>

        </div>

        <div className="home-hero-visual">

          <div className="home-hero-glow"></div>

          <div className="home-hero-card">

            <div className="home-hero-card-icon">
              <BsLightningChargeFill />
            </div>

            <div>
              <strong>AI-Powered Practice</strong>

              <span>
                Personalized questions
              </span>
            </div>

          </div>

          <div className="home-hero-circle">
            <BsStars />
          </div>

        </div>

      </section>


      {/* ==========================================
          QUICK STATS
      ========================================== */}

      <section className="home-stats-row">

        <div className="home-stat-card">

          <div className="home-stat-card-top">

            <div className="home-stat-icon-box">
              <BsChatSquareTextFill />
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
              <BsCheckCircleFill />
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
              <BsTrophyFill />
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


        <div className="home-stat-card">

          <div className="home-stat-card-top">

            <div className="home-stat-icon-box">
              <BsBullseye />
            </div>

            <span className="home-stat-label">
              Readiness
            </span>

          </div>

          <span className="home-stat-number">
            {performance?.hasData
              ? performance.readinessScore
              : 0}
          </span>

          <span className="home-stat-description">
            Interview readiness
          </span>

        </div>

      </section>


      {/* ==========================================
          AI PERFORMANCE
      ========================================== */}

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
                Understand your strengths and identify the
                areas that need more practice.
              </p>

            </div>


            <div className="home-readiness-score">

              <div className="home-readiness-ring">

                <span className="home-readiness-number">
                  {performance.readinessScore}
                </span>

                <span className="home-readiness-out-of">
                  /100
                </span>

              </div>

              <span className="home-readiness-text">
                Readiness Score
              </span>

            </div>

          </div>


          <div className="home-performance-insights">

            <div className="home-insight-card">

              <div className="home-insight-card-top">
                <span className="home-insight-label">
                  Strongest Skill
                </span>

                <span className="home-insight-dot home-dot-success"></span>
              </div>

              <strong>
                {getSkillName(
                  performance.strongestSkill?.name
                )}
              </strong>

              <span className="home-insight-score">
                {performance.strongestSkill?.score}/100
              </span>

            </div>


            <div className="home-insight-card">

              <div className="home-insight-card-top">
                <span className="home-insight-label">
                  Focus Area
                </span>

                <span className="home-insight-dot home-dot-warning"></span>
              </div>

              <strong>
                {getSkillName(
                  performance.improvementArea?.name
                )}
              </strong>

              <span className="home-insight-score">
                {performance.improvementArea?.score}/100
              </span>

            </div>


            <div className="home-insight-card">

              <div className="home-insight-card-top">
                <span className="home-insight-label">
                  Recent Trend
                </span>

                <span className="home-insight-dot home-dot-info"></span>
              </div>

              <strong>
                {performance.recentTrend > 0
                  ? `+${performance.recentTrend}`
                  : performance.recentTrend}
              </strong>

              <span className="home-insight-score">
                vs previous interview
              </span>

            </div>

          </div>

        </section>
      )}


      {/* ==========================================
          RECENT INTERVIEWS
      ========================================== */}

      <section className="home-recent-section">

        <div className="home-section-header">

          <div>

            <div className="home-section-eyebrow">
              Interview Activity
            </div>

            <h2 className="home-section-heading">
              Recent Interviews
            </h2>

            <p className="home-section-subtitle">
              Review your latest AI interview sessions.
            </p>

          </div>


          {recentInterviews.length > 0 && (
            <button
              className="home-view-all-btn"
              onClick={() => navigate('/history')}
            >
              View All
              <BsArrowRight />
            </button>
          )}

        </div>


        {/* Loading */}

        {loading && (
          <div className="home-loading-state">

            <div
              className="spinner-border home-loading-spinner"
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

            <div className="home-empty-icon-box">
              <BsChatSquareText />
            </div>

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
              <BsArrowRight />
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