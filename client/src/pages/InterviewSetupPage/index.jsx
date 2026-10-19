import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  uploadResume,
  getResume,
  startInterview,
} from '../../services/interviewService.js';

import INTERVIEW_ROLES from '../../constants/roles.js';
import DIFFICULTY_LEVELS from '../../constants/difficulty.js';

import {
  BsDisplay,
  BsServer,
  BsLightningFill,
  BsGraphUp,
  BsCloudFill,
  BsStarFill,
  BsStar,
  BsFileEarmarkArrowUp,
  BsCheckCircleFill,
} from 'react-icons/bs';

import { FaPython, FaReact, FaJava } from 'react-icons/fa';

import toast from 'react-hot-toast';

import './index.css';


// =========================================================
// ROLE ICONS
// =========================================================

const ROLE_ICONS = {
  'frontend-developer': BsDisplay,
  'backend-developer': BsServer,
  'full-stack-developer': BsLightningFill,
  'data-analyst': BsGraphUp,
  'devops-engineer': BsCloudFill,
  'python-developer': FaPython,
  'react-developer': FaReact,
  'java-developer': FaJava,
};


// =========================================================
// DIFFICULTY ICONS
// =========================================================

const DIFFICULTY_ICONS = {
  easy: (
    <span className="setup-difficulty-stars">
      <BsStarFill className="setup-star-filled" />
      <BsStar className="setup-star-empty" />
      <BsStar className="setup-star-empty" />
    </span>
  ),

  medium: (
    <span className="setup-difficulty-stars">
      <BsStarFill className="setup-star-filled" />
      <BsStarFill className="setup-star-filled" />
      <BsStar className="setup-star-empty" />
    </span>
  ),

  hard: (
    <span className="setup-difficulty-stars">
      <BsStarFill className="setup-star-filled" />
      <BsStarFill className="setup-star-filled" />
      <BsStarFill className="setup-star-filled" />
    </span>
  ),
};


// =========================================================
// COMPONENT
// =========================================================

function InterviewSetupPage() {
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------

  const [step, setStep] = useState(1);

  const [selectedRole, setSelectedRole] = useState('');

  const [selectedDifficulty, setSelectedDifficulty] =
    useState('medium');

  const [resumeText, setResumeText] = useState('');

  const [resumeFileName, setResumeFileName] = useState('');

  const [loading, setLoading] = useState(false);

  const [uploadingResume, setUploadingResume] = useState(false);


  // ---------------------------------------------------------
  // LOAD EXISTING RESUME
  // ---------------------------------------------------------

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await getResume();

        if (data) {
          setResumeText(data.text);
          setResumeFileName(data.fileName);
        }
      } catch (error) {
        // No resume found.
        // This is okay because the user can upload one.
      }
    };

    loadResume();
  }, []);


  // ---------------------------------------------------------
  // HANDLE RESUME UPLOAD
  // ---------------------------------------------------------

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Only allow PDF files
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.');
      return;
    }

    setUploadingResume(true);

    try {
      const data = await uploadResume(file);

      setResumeText(data.text);
      setResumeFileName(data.fileName);

      toast.success('Resume uploaded successfully!');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to upload resume';

      toast.error(message);
    } finally {
      setUploadingResume(false);
    }
  };


  // ---------------------------------------------------------
  // START INTERVIEW
  // ---------------------------------------------------------

  const handleStartInterview = async () => {
    if (!selectedRole) {
      toast.error('Please select a role.');
      return;
    }

    if (!resumeText) {
      toast.error('Please upload your resume.');
      return;
    }

    setLoading(true);

    try {
      const difficultyConfig = DIFFICULTY_LEVELS.find(
        (difficulty) => difficulty.id === selectedDifficulty
      );

      const totalQuestions = difficultyConfig
        ? difficultyConfig.questions
        : 5;

      const data = await startInterview(
        selectedRole,
        resumeText,
        totalQuestions
      );

      toast.success('Interview started!');

      navigate(`/interview/${data.interviewId}`, {
        state: {
          audio: data.audio,
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to start interview';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  // ---------------------------------------------------------
  // NEXT STEP
  // ---------------------------------------------------------

  const handleNext = () => {
    if (step === 1 && !selectedRole) {
      toast.error('Please select a role.');
      return;
    }

    setStep((previousStep) =>
      Math.min(previousStep + 1, 3)
    );
  };


  // ---------------------------------------------------------
  // PREVIOUS STEP
  // ---------------------------------------------------------

  const handleBack = () => {
    setStep((previousStep) =>
      Math.max(previousStep - 1, 1)
    );
  };


  // =========================================================
  // LOADING / PREPARING INTERVIEW SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="setup-page">

        <div className="setup-preparing">

          <div
            className="spinner-border setup-preparing-spinner"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <h2 className="setup-preparing-heading">
            Preparing Your Interview...
          </h2>

          <p className="setup-preparing-text">
            AI is analyzing your resume and generating
            personalized questions for the{' '}
            <strong>{selectedRole}</strong> role.
          </p>


          <div className="setup-preparing-steps">

            <div className="setup-prep-step">
              <BsCheckCircleFill
                className="setup-prep-step-icon-active"
              />

              <span className="setup-prep-step-text">
                Analyzing resume
              </span>
            </div>


            <div className="setup-prep-step">
              <BsCheckCircleFill
                className="setup-prep-step-icon-active"
              />

              <span className="setup-prep-step-text">
                Generating questions
              </span>
            </div>


            <div className="setup-prep-step">
              <BsCheckCircleFill
                className="setup-prep-step-icon-pending"
              />

              <span className="setup-prep-step-text">
                Setting up voice interviewer
              </span>
            </div>

          </div>


          <p className="setup-preparing-hint">
            This may take 10–15 seconds...
          </p>

        </div>

      </div>
    );
  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="setup-page">

      <div className="setup-container">


        {/* ===================================================
            HERO SECTION
        =================================================== */}

        <div className="setup-hero">

          <div className="setup-hero-badge">
            <BsLightningFill />

            <span>
              AI Interview Coach
            </span>
          </div>


          <h1 className="setup-hero-title">
            Build Your Perfect Interview
          </h1>


          <p className="setup-hero-description">
            Choose your role, difficulty, and resume to
            create a personalized AI-powered interview
            experience.
          </p>

        </div>


        {/* ===================================================
            STEP INDICATOR
        =================================================== */}

        <div className="setup-stepper">


          {/* STEP 1 */}

          <div
            className={`setup-step ${
              step >= 1 ? 'active' : ''
            }`}
          >

            <span className="setup-step-number">
              1
            </span>

            <div className="setup-step-content">

              <strong>
                Role
              </strong>

              <small>
                Choose your role
              </small>

            </div>

          </div>


          {/* LINE */}

          <div
            className={`setup-step-line ${
              step >= 2 ? 'active' : ''
            }`}
          />


          {/* STEP 2 */}

          <div
            className={`setup-step ${
              step >= 2 ? 'active' : ''
            }`}
          >

            <span className="setup-step-number">
              2
            </span>

            <div className="setup-step-content">

              <strong>
                Difficulty
              </strong>

              <small>
                Set challenge level
              </small>

            </div>

          </div>


          {/* LINE */}

          <div
            className={`setup-step-line ${
              step >= 3 ? 'active' : ''
            }`}
          />


          {/* STEP 3 */}

          <div
            className={`setup-step ${
              step >= 3 ? 'active' : ''
            }`}
          >

            <span className="setup-step-number">
              3
            </span>

            <div className="setup-step-content">

              <strong>
                Resume
              </strong>

              <small>
                Personalize interview
              </small>

            </div>

          </div>

        </div>


        {/* ===================================================
            STEP 1 — ROLE
        =================================================== */}

        {step === 1 && (

          <div className="setup-section">

            <div className="setup-section-header">

              <h2 className="setup-section-heading">
                Select Interview Role
              </h2>

              <p className="setup-section-subtitle">
                Choose the role you want the AI interviewer
                to focus on.
              </p>

            </div>


            <div className="setup-roles-grid">

              {INTERVIEW_ROLES.map((role) => {

                const RoleIcon = ROLE_ICONS[role.id];

                const isSelected =
                  selectedRole === role.title;


                return (

                  <button
                    key={role.id}
                    type="button"
                    className={`setup-role-card ${
                      isSelected
                        ? 'setup-role-selected'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedRole(role.title)
                    }
                  >

                    {/* ICON */}

                    <div className="setup-role-icon-wrap">

                      {RoleIcon && (
                        <RoleIcon
                          className="setup-role-icon"
                        />
                      )}

                    </div>


                    {/* CHECK ICON */}

                    {isSelected && (

                      <BsCheckCircleFill
                        className="setup-role-check"
                      />

                    )}


                    {/* TITLE */}

                    <h3 className="setup-role-title">
                      {role.title}
                    </h3>


                    {/* DESCRIPTION */}

                    <p className="setup-role-desc">
                      {role.description}
                    </p>


                    {/* SELECT LABEL */}

                    <span className="setup-role-select-text">

                      {isSelected
                        ? 'Selected'
                        : 'Select role'}

                    </span>

                  </button>

                );
              })}

            </div>

          </div>

        )}


        {/* ===================================================
            STEP 2 — DIFFICULTY
        =================================================== */}

        {step === 2 && (

          <div className="setup-section">

            <div className="setup-section-header">

              <h2 className="setup-section-heading">
                Choose Difficulty
              </h2>

              <p className="setup-section-subtitle">
                Select how challenging you want your
                interview to be.
              </p>

            </div>


            <div className="setup-difficulty-row">

              {DIFFICULTY_LEVELS.map((level) => {

                const isSelected =
                  selectedDifficulty === level.id;


                return (

                  <button
                    key={level.id}
                    type="button"
                    className={`setup-difficulty-card ${
                      isSelected
                        ? 'setup-difficulty-selected'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedDifficulty(level.id)
                    }
                  >

                    {/* STARS */}

                    {DIFFICULTY_ICONS[level.id]}


                    {/* TITLE */}

                    <h3 className="setup-difficulty-label">
                      {level.label}
                    </h3>


                    {/* DESCRIPTION */}

                    <p className="setup-difficulty-desc">
                      {level.description}
                    </p>


                    {/* QUESTION COUNT */}

                    <span className="setup-difficulty-count">

                      {level.questions} questions

                    </span>

                  </button>

                );
              })}

            </div>

          </div>

        )}


        {/* ===================================================
            STEP 3 — RESUME
        =================================================== */}

        {step === 3 && (

          <div className="setup-section">

            <div className="setup-section-header">

              <h2 className="setup-section-heading">
                Upload Your Resume
              </h2>

              <p className="setup-section-subtitle">
                Your resume helps the AI generate
                personalized interview questions.
              </p>

            </div>


            <div className="setup-resume-area">

              {resumeText ? (

                /* -------------------------------------------
                   RESUME UPLOADED
                ------------------------------------------- */

                <div className="setup-resume-uploaded">

                  <div className="setup-resume-info">

                    <div className="setup-resume-icon-wrap">

                      <BsFileEarmarkArrowUp
                        className="setup-resume-file-icon"
                      />

                    </div>


                    <div className="setup-resume-details">

                      <p className="setup-resume-label">
                        Resume uploaded
                      </p>

                      <p className="setup-resume-name">
                        {resumeFileName}
                      </p>

                    </div>

                  </div>


                  <label className="setup-change-resume-btn">

                    Change Resume

                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleResumeUpload}
                      hidden
                    />

                  </label>

                </div>

              ) : (

                /* -------------------------------------------
                   UPLOAD ZONE
                ------------------------------------------- */

                <label className="setup-upload-zone">

                  <div className="setup-upload-icon-wrap">

                    <BsFileEarmarkArrowUp
                      className="setup-upload-icon"
                    />

                  </div>


                  <p className="setup-upload-text">

                    {uploadingResume
                      ? 'Uploading your resume...'
                      : 'Upload your PDF resume'}

                  </p>


                  <p className="setup-upload-subtitle">

                    PDF only • Your resume helps AI
                    personalize your interview questions

                  </p>


                  {!uploadingResume && (

                    <span className="setup-upload-button-text">
                      Choose PDF
                    </span>

                  )}


                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    hidden
                  />

                </label>

              )}

            </div>

          </div>

        )}


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <div className="setup-nav-buttons">


          {/* BACK */}

          {step > 1 && (

            <button
              type="button"
              className="setup-back-btn"
              onClick={handleBack}
            >
              Back
            </button>

          )}


          {/* NEXT */}

          {step < 3 ? (

            <button
              type="button"
              className="setup-next-btn"
              onClick={handleNext}
            >
              Continue
            </button>

          ) : (

            /* START INTERVIEW */

            <button
              type="button"
              className={`setup-start-btn ${
                loading ||
                !selectedRole ||
                !resumeText
                  ? 'setup-start-btn-disabled'
                  : ''
              }`}
              onClick={handleStartInterview}
              disabled={
                loading ||
                !selectedRole ||
                !resumeText
              }
            >
              Start AI Interview
            </button>

          )}

        </div>

      </div>

    </div>
  );
}


export default InterviewSetupPage;
