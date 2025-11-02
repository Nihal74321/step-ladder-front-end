import React from 'react';
import { LeaderboardEntry } from '../../types';
import './LeaderboardItem.css';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  onClick: () => void;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  entry,
  onClick,
}) => {
  const formatSteps = (steps: number) => {
    return steps.toLocaleString();
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return (
        <div className="trend-icon trend-icon--up">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
    if (trend < 0) {
      return (
        <div className="trend-icon trend-icon--down">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
    return (
      <div className="trend-icon trend-icon--neutral">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'leaderboard-item--gold';
    if (rank === 2) return 'leaderboard-item--silver';
    if (rank === 3) return 'leaderboard-item--bronze';
    return '';
  };

  return (
    <div 
      className={`leaderboard-item ${getRankClass(entry.rank)}`}
      onClick={onClick}
    >
      <div className="leaderboard-item__rank">
        {entry.rank}
      </div>
      
      <div className="leaderboard-item__avatar">
        <div className="avatar">
          <span>{entry.username.charAt(0)}</span>
        </div>
      </div>
      
      <div className="leaderboard-item__info">
        <div className="leaderboard-item__name">
          {entry.username}
        </div>
        {entry.tag && (
          <div className="leaderboard-item__tag">
            #{entry.tag}
          </div>
        )}
      </div>
      
      <div className="leaderboard-item__steps">
        <span className="steps-count">
          {formatSteps(entry.total_steps)} Steps
        </span>
        {getTrendIcon(entry.trend)}
      </div>
    </div>
  );
};