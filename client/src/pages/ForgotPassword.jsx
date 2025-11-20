import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: reset password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      // If email exists, move to step 2
      if (response.data.success) {
        setMessage(response.data.message);
        setStep(2);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError('No account found with this email address');
      } else {
        setError(error.response?.data?.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        newPassword
      });
      
      setMessage(response.data.message);
      
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card forgot-password-card">
        <div className="auth-header">
          <div className="auth-icon">
            {step === 1 ? '🔐' : '🔑'}
          </div>
          <h2>{step === 1 ? 'Reset Password' : 'Create New Password'}</h2>
          <p className="auth-subtitle">
            {step === 1 
              ? 'Enter your email address to reset your password' 
              : 'Enter your new password below'
            }
          </p>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="form-input"
              />
            </div>
            
            {error && (
              <div className="error-message">
                <span className="message-icon">⚠️</span>
                {error}
              </div>
            )}
            {message && (
              <div className="success-message">
                <span className="message-icon">✅</span>
                {message}
              </div>
            )}
            
            <button type="submit" disabled={loading} className="auth-button primary-button">
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Checking...
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <span className="button-icon">→</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="auth-form">
            <div className="reset-info-card">
              <div className="info-icon">👤</div>
              <p>Setting new password for:</p>
              <strong className="email-display">{email}</strong>
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">
                <span className="label-icon">🔒</span>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password (min. 6 characters)"
                minLength={6}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <span className="label-icon">🔒</span>
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your new password"
                minLength={6}
                className="form-input"
              />
            </div>
            
            {error && (
              <div className="error-message">
                <span className="message-icon">⚠️</span>
                {error}
              </div>
            )}
            {message && (
              <div className="success-message">
                <span className="message-icon">🎉</span>
                {message}
              </div>
            )}
            
            <button type="submit" disabled={loading} className="auth-button primary-button">
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  <span>Update Password</span>
                  <span className="button-icon">✓</span>
                </>
              )}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="secondary-button"
            >
              <span className="button-icon">←</span>
              Back to Email Entry
            </button>
          </form>
        )}
        
        <div className="auth-footer">
          <button 
            type="button" 
            onClick={() => navigate('/login')} 
            className="link-button"
          >
            <span className="button-icon">🏠</span>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
