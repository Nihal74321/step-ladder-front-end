import React from 'react';
import { LeaderboardItem } from './LeaderboardItem';
import { LeaderboardEntry } from '../../types';
import './LeaderboardTable.css';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  isLoading: boolean;
  onUserClick: (user: LeaderboardEntry) => void;
  currentWeek: number;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  data,
  isLoading,
  onUserClick,
  currentWeek,
}) => {
  if (isLoading) {
    return (
      <div className="leaderboard-table">
        <div className="leaderboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="leaderboard-table leaderboard-table--empty">
        <div className="leaderboard-empty">
          <div className="empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="empty-title">No Entries for Week</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-table">
      <div className="leaderboard-list">
        {data.map((entry) => (
          <LeaderboardItem
            key={entry.uuid}
            entry={entry}
            onClick={() => onUserClick(entry)}
          />
        ))}
      </div>
    </div>
  );
};