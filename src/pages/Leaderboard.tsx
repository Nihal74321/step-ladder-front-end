import React, { useState, useEffect } from 'react';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { UserProfileModal } from '../components/leaderboard/UserProfileModal';
import { WeekSelector } from '../components/leaderboard/WeekSelector';
import { LeaderboardEntry, User } from '../types';
import { getCurrentWeek, getAllWeeks, formatWeekStats } from '../utils/WeekSystem';
import { leaderboardService } from '../services/apiService';
import './Leaderboard.css';

interface LeaderboardProps {
  user: User;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ user }) => {
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const availableWeeks = getAllWeeks();
  const currentWeek = getCurrentWeek();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      
      try {
        const response = await leaderboardService.getLeaderboard(selectedWeek);
        if (response.success && response.data) {
          setLeaderboardData(response.data);
        } else {
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedWeek]);

  const handleUserClick = (userEntry: LeaderboardEntry) => {
    setSelectedUser(userEntry);
    setIsProfileModalOpen(true);
  };

  const handleWeekChange = (week: number) => {
    const validWeek = Math.max(1, Math.min(week, currentWeek));
    setSelectedWeek(validWeek);
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <WeekSelector 
          selectedWeek={selectedWeek}
          onWeekChange={handleWeekChange}
          availableWeeks={availableWeeks}
          weekStats={formatWeekStats(selectedWeek)}
        />
        
        <LeaderboardTable
          data={leaderboardData}
          isLoading={isLoading}
          onUserClick={handleUserClick}
          currentWeek={selectedWeek}
        />
      </div>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUser}
        currentWeek={selectedWeek}
      />
    </div>
  );
};