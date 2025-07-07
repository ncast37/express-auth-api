import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState('default');
  const [showSuccess, setShowSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        // Handle validation errors from backend
        if (result.errors && Array.isArray(result.errors)) {
          const backendErrors = {};
          result.errors.forEach(error => {
            backendErrors[error.path || error.param] = error.msg;
          });
          setErrors(backendErrors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'mocha': return 'mocha-theme';
      case 'glass': return 'glass-theme';
      default: return '';
    }
  };

  const getButtonText = () => {
    if (showSuccess) return '✓ Welcome Back!';
    if (isSubmitting) return 'Signing In...';
    return 'Sign In';
  };

  const getButtonClass = () => {
    let className = 'btn-primary';
    if (isSubmitting) className += ' loading';
    if (showSuccess) className += ' success';
    return className;
  };

  return (
    <div className="form-container">
      {/* Theme Selector */}
      <div className="theme-selector">
        <h3>Choose Theme</h3>
        <div className="theme-options">
          <div 
            className={`theme-option default ${theme === 'default' ? 'active' : ''}`}
            onClick={() => setTheme('default')}
            title="Default Theme"
          />
          <div 
            className={`theme-option mocha ${theme === 'mocha' ? 'active' : ''}`}
            onClick={() => setTheme('mocha')}
            title="Mocha Theme"
          />
          <div 
            className={`theme-option glass ${theme === 'glass' ? 'active' : ''}`}
            onClick={() => setTheme('glass')}
            title="Glass Theme"
          />
        </div>
      </div>

      <div className={`form-card ${getThemeClass()}`}>
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Sign in to your account to continue</p>
        
        {errors.general && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className={getButtonClass()}
            disabled={isSubmitting || showSuccess}
          >
            {getButtonText()}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <button className="social-btn" disabled>
            <span>🔍</span> Continue with Google
          </button>
        </div>
        
        <div>
          <button className="social-btn" disabled>
            <span>🍎</span> Continue with Apple
          </button>
        </div>

        <div className="signin-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
