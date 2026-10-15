import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
  MdDashboard,
  MdHistory,
  MdPerson,
  MdPlayArrow,
  MdLogout,
  MdNotifications,
  MdKeyboardArrowDown,
} from 'react-icons/md';
import { BsStars } from 'react-icons/bs';
import './index.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <>
      <aside className="sidebar">
        <Link to="/" className="sidebar-brand">
          <div className="sidebar-logo">
            <BsStars />
          </div>
          <div>
            <h2>AI Interview <span>Coach</span></h2>
            <p>Practice · Improve · Succeed</p>
          </div>
        </Link>

        <div className="sidebar-menu">
          <Link
            to="/"
            className={`sidebar-link ${
              location.pathname === '/' ? 'active' : ''
            }`}
          >
            <MdDashboard />
            Dashboard
          </Link>

          <Link
            to="/setup"
            className={`sidebar-link ${
              location.pathname === '/setup' ? 'active' : ''
            }`}
          >
            <MdPlayArrow />
            Start Interview
          </Link>

          <Link
            to="/history"
            className={`sidebar-link ${
              location.pathname === '/history' ? 'active' : ''
            }`}
          >
            <MdHistory />
            History
          </Link>

          <Link to="/" className="sidebar-link">
            <MdPerson />
            Profile
          </Link>
        </div>

        <div className="sidebar-promo">
          <BsStars />
          <h3>Better Practice<br />Bigger Opportunities</h3>
          <p>Build your confidence and get job ready with AI.</p>
          <div className="promo-robot">🤖</div>
        </div>
      </aside>

      <header className="top-header">
        <div className="search-box">
          <span>⌕</span>
          <input placeholder="Search anything..." />
        </div>

        <div className="top-user">
          <MdNotifications className="notification-icon" />

          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>

          <span>{user?.name?.split(' ')[0] || 'Anu'}</span>
          <MdKeyboardArrowDown />

          <button
            className="top-logout"
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            title="Logout"
          >
            <MdLogout />
          </button>
        </div>
      </header>
    </>
  );
}

export default Navbar;