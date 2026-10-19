import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsBugFill,
  BsCheckCircleFill,
  BsArrowLeft,
  BsLightbulbFill,
  BsCodeSlash,
} from 'react-icons/bs';
import './index.css';

function DebuggingPage() {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [code, setCode] = useState(`function calculateTotal(items) {
  let total = 0;

  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }

  return total;
}`);

  const [explanation, setExplanation] = useState('');

  const handleSubmit = () => {
    alert('Debugging solution submitted!');
  };

  return (
    <div className="debug-page">

      {/* Header */}
      <header className="debug-header">
        <div className="debug-brand">
          <div className="debug-brand-icon">
            <BsBugFill />
          </div>

          <div>
            <h1>CareerForge AI</h1>
            <span>Debugging Interview</span>
          </div>
        </div>

        <div className="debug-progress">
          <span>Challenge 1 of 3</span>
          <div className="debug-progress-bar">
            <div className="debug-progress-fill"></div>
          </div>
        </div>

        <button
          className="debug-exit-btn"
          onClick={() => navigate('/')}
        >
          <BsArrowLeft />
          Exit
        </button>
      </header>

      {/* Main */}
      <main className="debug-main">

        {/* Left side */}
        <section className="debug-problem-panel">

          <div className="debug-badge">
            <BsBugFill />
            Real-World Debugging
          </div>

          <h2>
            Users are unable to calculate their order total.
          </h2>

          <p className="debug-description">
            The checkout page crashes when customers add multiple products
            to their cart. Your task is to investigate the problem and fix it.
          </p>

          <div className="debug-info-card">
            <div className="debug-info-icon">
              <BsLightbulbFill />
            </div>

            <div>
              <h3>Your task</h3>
              <p>
                Identify the bug, explain why it happens, and provide a
                corrected solution.
              </p>
            </div>
          </div>

          <div className="debug-checklist">

            <div>
              <BsCheckCircleFill />
              <span>Find the bug</span>
            </div>

            <div>
              <BsCheckCircleFill />
              <span>Explain the problem</span>
            </div>

            <div>
              <BsCheckCircleFill />
              <span>Fix the code</span>
            </div>

          </div>

        </section>

        {/* Right side */}
        <section className="debug-workspace">

          <div className="debug-workspace-header">

            <div className="debug-code-title">
              <BsCodeSlash />
              Code Workspace
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
            </select>

          </div>

          <textarea
            className="debug-code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />

          <div className="debug-explanation">

            <label>
              Explain what is wrong
            </label>

            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain the bug and why it causes the problem..."
            />

          </div>

          <div className="debug-submit-area">

            <span>
              Take your time and explain your reasoning clearly.
            </span>

            <button
              className="debug-submit-btn"
              onClick={handleSubmit}
            >
              Submit Solution
              <BsCheckCircleFill />
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default DebuggingPage;