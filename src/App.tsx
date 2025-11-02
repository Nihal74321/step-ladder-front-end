import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Leaderboard } from './pages/Leaderboard';
import { AdminPanel } from './pages/AdminPanel';
import { AuthState, User } from './types';
import './App.css';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('stepladder_token');
        const userData = localStorage.getItem('stepladder_user');
        
        if (token && userData) {
          const user: User = JSON.parse(userData);
          setAuthState({
            isAuthenticated: true,
            user,
            token,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('stepladder_token');
        localStorage.removeItem('stepladder_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthenticated = (user: User, token: string) => {
    localStorage.setItem('stepladder_token', token);
    localStorage.setItem('stepladder_user', JSON.stringify(user));

    setAuthState({
      isAuthenticated: true,
      user,
      token,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('stepladder_token');
    localStorage.removeItem('stepladder_user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading StepLadder...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {authState.isAuthenticated && (
          <nav style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '1rem' }}>
            <a href="/leaderboard" style={{ marginRight: '1rem' }}>Leaderboard</a>
            <a href="/admin" style={{ marginRight: '1rem' }}>Admin</a>
            <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Logout</button>
          </nav>
        )}
        
        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={
                !authState.isAuthenticated ? (
                  <Landing onAuthenticated={handleAuthenticated} />
                ) : (
                  <Navigate to="/leaderboard" replace />
                )
              }
            />
            <Route
              path="/leaderboard"
              element={
                authState.isAuthenticated ? (
                  <Leaderboard user={authState.user!} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin"
              element={
                authState.isAuthenticated ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                <Navigate
                  to={authState.isAuthenticated ? "/leaderboard" : "/login"}
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;