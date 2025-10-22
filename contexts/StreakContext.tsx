import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Streak, Milestone } from '../types';

interface StreakContextType {
  streak: Streak;
  updateStreak: () => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

// Streak milestones
const STREAK_MILESTONES: Milestone[] = [
  { days: 3, title: 'Getting Started', achieved: false, icon: '🌱' },
  { days: 7, title: 'One Week', achieved: false, icon: '🔥' },
  { days: 14, title: 'Two Weeks', achieved: false, icon: '⚡' },
  { days: 30, title: 'One Month', achieved: false, icon: '💪' },
  { days: 60, title: 'Two Months', achieved: false, icon: '🚀' },
  { days: 90, title: 'Three Months', achieved: false, icon: '🏆' },
  { days: 180, title: 'Half Year', achieved: false, icon: '👑' },
  { days: 365, title: 'One Year', achieved: false, icon: '💎' },
];

export const StreakProvider = ({ children }: { children: ReactNode }) => {
  const [streak, setStreak] = useState<Streak>({
    currentStreak: 0,
    longestStreak: 0,
    lastDepositDate: null,
    milestones: [...STREAK_MILESTONES],
  });

  const updateStreak = () => {
    setStreak((prev) => {
      const now = new Date();
      const lastDeposit = prev.lastDepositDate;

      let newCurrentStreak = prev.currentStreak;

      if (!lastDeposit) {
        // First deposit ever
        newCurrentStreak = 1;
      } else {
        const daysSinceLastDeposit = Math.floor(
          (now.getTime() - lastDeposit.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastDeposit === 1) {
          // Deposited yesterday, continue streak
          newCurrentStreak = prev.currentStreak + 1;
        } else if (daysSinceLastDeposit === 0) {
          // Deposited today already
          newCurrentStreak = prev.currentStreak;
        } else {
          // Streak broken
          newCurrentStreak = 1;
        }
      }

      const newLongestStreak = Math.max(newCurrentStreak, prev.longestStreak);

      // Update milestones
      const updatedMilestones = prev.milestones.map((milestone) => ({
        ...milestone,
        achieved: newCurrentStreak >= milestone.days,
      }));

      return {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastDepositDate: now,
        milestones: updatedMilestones,
      };
    });
  };

  return (
    <StreakContext.Provider value={{ streak, updateStreak }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreak must be used within StreakProvider');
  }
  return context;
};
