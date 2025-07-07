import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="logout-btn"
            aria-label="Logout from your account"
          >
            Logout
          </button>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h2 className="user-name">{user?.name}</h2>
            <p className="user-email">{user?.email}</p>
            <p className="signup-date">
              Member since {user?.signupDate ? formatDate(user.signupDate) : 'Unknown'}
            </p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="welcome-message">
            <h3>🎉 Account Successfully Created!</h3>
            <p>
              Your account has been created and you're now logged in. 
              This dashboard demonstrates successful authentication with the backend API.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h4>Secure Authentication</h4>
              <p>JWT-based authentication with protected routes</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h4>Modern Design</h4>
              <p>Contemporary UI with multiple theme options</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Real-time Validation</h4>
              <p>Instant feedback and password strength indicators</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">♿</div>
              <h4>Accessible</h4>
              <p>WCAG compliant with keyboard navigation support</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding: 40px 20px;
        }

        .dashboard-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 800px;
          position: relative;
        }

        .dashboard-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px 20px 0 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }

        .logout-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 101, 101, 0.3);
        }

        .user-info {
          display: flex;
          align-items: center;
          background: #f8fafc;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 30px;
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-right: 24px;
        }

        .user-details h2 {
          font-size: 1.5rem;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .user-email {
          color: #667eea;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .signup-date {
          color: #718096;
          font-size: 0.9rem;
          margin: 0;
        }

        .dashboard-content {
          margin-top: 30px;
        }

        .welcome-message {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 30px;
          text-align: center;
        }

        .welcome-message h3 {
          margin: 0 0 12px 0;
          font-size: 1.3rem;
        }

        .welcome-message p {
          margin: 0;
          opacity: 0.9;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .feature-card {
          background: #f8fafc;
          padding: 24px;
          border-radius: 16px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .feature-card h4 {
          color: #2d3748;
          margin: 0 0 12px 0;
          font-size: 1.1rem;
        }

        .feature-card p {
          color: #718096;
          margin: 0;
          font-size: 0.9rem;
        }

        /* Enhanced mobile responsiveness */
        @media (max-width: 1024px) {
          .dashboard-container {
            padding: 20px 15px;
          }
          
          .dashboard-card {
            padding: 30px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 15px 10px;
          }

          .dashboard-card {
            padding: 24px 20px;
            border-radius: 16px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 24px;
            padding-bottom: 16px;
          }

          .dashboard-title {
            font-size: 1.5rem;
            line-height: 1.3;
          }

          .logout-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
            align-self: flex-end;
            width: auto;
          }

          .user-info {
            flex-direction: column;
            text-align: center;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
          }

          .user-avatar {
            margin: 0 0 16px 0;
            width: 70px;
            height: 70px;
            font-size: 1.8rem;
          }

          .user-details h2 {
            font-size: 1.3rem;
          }

          .user-email {
            font-size: 0.95rem;
          }

          .signup-date {
            font-size: 0.85rem;
          }

          .welcome-message {
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
          }

          .welcome-message h3 {
            font-size: 1.2rem;
            margin-bottom: 10px;
          }

          .welcome-message p {
            font-size: 0.9rem;
            line-height: 1.5;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .feature-card {
            padding: 20px;
            border-radius: 12px;
          }

          .feature-icon {
            font-size: 2.2rem;
            margin-bottom: 12px;
          }

          .feature-card h4 {
            font-size: 1rem;
            margin-bottom: 10px;
          }

          .feature-card p {
            font-size: 0.85rem;
            line-height: 1.4;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 10px 5px;
          }

          .dashboard-card {
            padding: 20px 16px;
            border-radius: 12px;
          }

          .dashboard-header {
            margin-bottom: 20px;
            padding-bottom: 12px;
          }

          .dashboard-title {
            font-size: 1.3rem;
          }

          .logout-btn {
            padding: 8px 16px;
            font-size: 0.85rem;
          }

          .user-info {
            padding: 16px;
            margin-bottom: 20px;
          }

          .user-avatar {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
            margin-bottom: 12px;
          }

          .user-details h2 {
            font-size: 1.2rem;
            margin-bottom: 6px;
          }

          .welcome-message {
            padding: 16px;
            margin-bottom: 20px;
          }

          .welcome-message h3 {
            font-size: 1.1rem;
          }

          .welcome-message p {
            font-size: 0.85rem;
          }

          .features-grid {
            gap: 12px;
          }

          .feature-card {
            padding: 16px;
          }

          .feature-icon {
            font-size: 2rem;
            margin-bottom: 10px;
          }

          .feature-card h4 {
            font-size: 0.95rem;
            margin-bottom: 8px;
          }

          .feature-card p {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 360px) {
          .dashboard-card {
            padding: 16px 12px;
          }

          .dashboard-title {
            font-size: 1.2rem;
          }

          .user-info {
            padding: 12px;
          }

          .welcome-message {
            padding: 12px;
          }

          .feature-card {
            padding: 12px;
          }
        }

        /* Landscape mobile orientation */
        @media (max-height: 500px) and (orientation: landscape) {
          .dashboard-container {
            padding: 5px;
          }

          .dashboard-card {
            padding: 16px;
          }

          .dashboard-header {
            margin-bottom: 16px;
            padding-bottom: 8px;
          }

          .dashboard-title {
            font-size: 1.2rem;
          }

          .user-info {
            flex-direction: row;
            text-align: left;
            padding: 12px;
            margin-bottom: 16px;
          }

          .user-avatar {
            margin: 0 16px 0 0;
            width: 50px;
            height: 50px;
            font-size: 1.3rem;
          }

          .welcome-message {
            padding: 12px;
            margin-bottom: 16px;
          }

          .features-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
          }

          .feature-card {
            padding: 12px;
          }

          .feature-icon {
            font-size: 1.8rem;
            margin-bottom: 8px;
          }
        }

        /* Dynamic viewport units for mobile browsers */
        @supports (height: 100dvh) {
          .dashboard-container {
            min-height: 100dvh;
          }
        }

        @supports (height: 100svh) {
          .dashboard-container {
            min-height: 100svh;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
