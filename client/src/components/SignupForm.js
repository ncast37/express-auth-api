import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMobileFormOptimization, useFocusManagement } from '../utils/mobileUtils';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState('default');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);
  
  // Mobile optimization hooks
  const { isMobile, isLandscape, keyboardOpen } = useMobileFormOptimization();
  const { focusFirstError } = useFocusManagement();

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

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/) || password.match(/[^a-zA-Z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    console.log('🚀 Starting signup process...');

    try {
      const result = await signup(formData);

      if (result.success) {
        console.log('✅ Signup successful!');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        console.log('❌ Signup failed:', result);
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
      console.error('🚫 Signup error caught:', error);

      // More specific error handling
      if (error.response?.status === 431) {
        setErrors({ general: 'Request too large. Please try again or contact support.' });
      } else if (error.response?.status >= 500) {
        setErrors({ general: 'Server error. Please try again later.' });
      } else if (error.response?.status === 409) {
        setErrors({ email: 'An account with this email already exists.' });
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      } else {
        setErrors({ general: error.response?.data?.message || 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
      // Focus first error field on mobile for better UX
      if (isMobile && Object.keys(errors).length > 0) {
        setTimeout(() => focusFirstError(formRef), 100);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordRequirements = () => {
    const password = formData.password;
    return [
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'Contains number or symbol', met: /[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password) }
    ];
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'mocha': return 'mocha-theme';
      case 'glass': return 'glass-theme';
      default: return '';
    }
  };

  const getButtonText = () => {
    if (showSuccess) return '✓ Account Created!';
    if (isSubmitting) return 'Creating Account...';
    return 'Create Account';
  };

  const getButtonClass = () => {
    let className = 'btn-primary';
    if (isSubmitting) className += ' loading';
    if (showSuccess) className += ' success';
    return className;
  };

  return (
    <div className={`form-container ${keyboardOpen ? 'keyboard-open' : ''} ${isLandscape ? 'landscape' : 'portrait'}`}>
      {/* Theme Selector - Hide when keyboard is open on mobile */}
      {(!isMobile || !keyboardOpen) && (
        <div className="theme-selector">
          <h3>Choose Theme</h3>
          <div className="theme-options">
            <div
              className={`theme-option default ${theme === 'default' ? 'active' : ''}`}
              onClick={() => setTheme('default')}
              title="Default Theme"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setTheme('default')}
            />
            <div
              className={`theme-option mocha ${theme === 'mocha' ? 'active' : ''}`}
              onClick={() => setTheme('mocha')}
              title="Mocha Theme"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setTheme('mocha')}
            />
            <div
              className={`theme-option glass ${theme === 'glass' ? 'active' : ''}`}
              onClick={() => setTheme('glass')}
              title="Glass Theme"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setTheme('glass')}
            />
          </div>
        </div>
      )}

      <form ref={formRef} className={`form-card ${getThemeClass()}`} onSubmit={handleSubmit}>
        <h2 className="form-title">Hey boo</h2>
        <p className="form-subtitle">You a cutie</p>

        {errors.general && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            required
            autoComplete="name"
            inputMode={isMobile ? 'text' : undefined}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

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
            inputMode={isMobile ? 'email' : undefined}
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
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
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

          {formData.password && (
            <>
              <div className="password-strength">
                <div
                  className="password-strength-bar"
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <div className="password-requirements">
                {getPasswordRequirements().map((req, index) => (
                  <div key={index} className={`requirement ${req.met ? 'met' : ''}`}>
                    {req.text}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          className={getButtonClass()}
          disabled={isSubmitting || showSuccess}
        >
          {getButtonText()}
        </button>
      </form>

      <div className="social-actions">
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
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
