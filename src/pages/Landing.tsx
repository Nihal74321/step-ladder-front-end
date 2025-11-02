import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { authService } from '../services/apiService';
import { User } from '../types';
import './Landing.css';

interface LandingProps {
  onAuthenticated: (user: User, token: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = isSignUp 
        ? await authService.register(username, email, password)
        : await authService.login(email, password);
      
      if (response.success && response.data) {
        onAuthenticated(response.data.user, response.data.token);
      } else {
        setError(response.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing">
      <div className="landing__container">
        <div className="landing__form">
          <h1 className="landing__title">
            {isSignUp ? 'Create Account' : 'Sign in'}
          </h1>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-form__error">
                {error}
              </div>
            )}
            
            {isSignUp && (
              <div className="form-field">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-field__input"
                  required
                />
              </div>
            )}

            <div className="form-field">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-field__input"
                required
              />
            </div>

            <div className="form-field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-field__input"
                required
              />
            </div>

            <Button
              type="submit"
              className="login-btn"
              loading={isLoading}
              disabled={isLoading}
            >
              {isSignUp ? 'Sign Up' : 'Log in'}
            </Button>
          </form>

          <Button
            variant="secondary"
            className="signup-btn"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={isLoading}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Button>
        </div>
      </div>
    </div>
  );
};