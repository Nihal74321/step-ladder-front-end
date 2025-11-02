import React, { useState } from 'react';
import { Button } from '../common/Button';
import './AuthForm.css';  

interface SignUpFormProps {
  onSignUp: (username: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSignUp,
  onSwitchToLogin,
  isLoading = false,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await onSignUp(username, email, password);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form__header">
        <h2>Create Account</h2>
        <p>Join the StepLadder community</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form__form">
        {error && (
          <div className="auth-form__error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          loading={isLoading}
          className="auth-form__submit"
        >
          Create Account
        </Button>

        <div className="auth-form__footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="auth-form__link"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};