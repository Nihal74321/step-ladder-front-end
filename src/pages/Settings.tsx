import React from 'react';
import { User } from '../types';
import './Settings.css';

interface SettingsProps {
  user: User;
}

export const Settings: React.FC<SettingsProps> = ({ user }) => {
  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Settings</h1>
        <p>Settings page coming soon...</p>
        <div className="user-info">
          <h2>User Info</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Tag:</strong> #{user.tag}</p>
        </div>
      </div>
    </div>
  );
};