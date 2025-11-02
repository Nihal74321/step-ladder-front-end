import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'social-dark';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className} ${
        loading ? 'btn--loading' : ''
      }`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="btn__spinner" />
      ) : (
        children
      )}
    </button>
  );
};