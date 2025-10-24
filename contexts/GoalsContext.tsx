import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavingsGoal } from '../types';
import { useNotifications } from './NotificationContext';

interface GoalsContextType {
  goals: SavingsGoal[];
  mainGoal: SavingsGoal | null;
  subGoals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  setMainGoal: (id: string) => void;
  updateGoalProgress: (id: string, amount: number) => void;
  clearAllGoals: () => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

const GOALS_STORAGE_KEY = '@stacksave_goals';

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const { addNotification } = useNotifications();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load goals from AsyncStorage on mount
  useEffect(() => {
    loadGoals();
  }, []);

  // Save goals to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveGoals();
    }
  }, [goals, isLoaded]);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals);
        // Convert date strings back to Date objects and add default currency for old goals
        const goalsWithDates = parsedGoals.map((goal: any) => ({
          ...goal,
          currency: goal.currency || 'IDR', // Default to IDR for backward compatibility
          startDate: new Date(goal.startDate),
          endDate: new Date(goal.endDate),
        }));
        setGoals(goalsWithDates);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const mainGoal = goals.find((g) => g.isMainGoal) || null;
  const subGoals = goals.filter((g) => !g.isMainGoal);

  const addGoal = (goalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: Date.now().toString(),
    };

    console.log('GoalsContext.addGoal called:', {
      title: newGoal.title,
      isMainGoal: newGoal.isMainGoal,
      currency: newGoal.currency,
      targetAmount: newGoal.targetAmount,
    });

    // If new goal is main goal, set all existing goals to not main goal
    if (newGoal.isMainGoal) {
      setGoals((prev) => {
        const updated = [
          ...prev.map((g) => ({ ...g, isMainGoal: false })),
          newGoal,
        ];
        console.log('Goals after adding (main goal):', updated.length, 'goals');
        return updated;
      });
    } else {
      setGoals((prev) => {
        const updated = [...prev, newGoal];
        console.log('Goals after adding (sub goal):', updated.length, 'goals');
        return updated;
      });
    }
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const setMainGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) => ({
        ...goal,
        isMainGoal: goal.id === id,
      }))
    );
  };

  const updateGoalProgress = (id: string, amount: number) => {
    console.log('GoalsContext.updateGoalProgress called:', { id, amount });
    setGoals((prev) => {
      const updated = prev.map((goal) => {
        if (goal.id === id) {
          const oldAmount = goal.currentAmount;
          const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
          const wasComplete = oldAmount >= goal.targetAmount;
          const isNowComplete = newAmount >= goal.targetAmount;

          console.log('Updating goal:', {
            goalId: id,
            oldAmount,
            addingAmount: amount,
            newAmount,
            targetAmount: goal.targetAmount,
            wasComplete,
            isNowComplete,
          });

          // Check if goal just became complete (milestone notifications)
          if (!wasComplete && isNowComplete) {
            // Goal achievement notification
            addNotification(
              'goal_achievement',
              '🎉 Goal Achieved!',
              `Congratulations! You've reached your "${goal.title}" goal of ${goal.currency === 'IDR' ? `Rp ${goal.targetAmount.toLocaleString('id-ID')}` : `$${goal.targetAmount.toFixed(2)}`}!`,
              'high',
              { goalId: id, goalTitle: goal.title, targetAmount: goal.targetAmount },
              '/(tabs)/portfolio'
            );
          } else {
            // Check for milestone percentages (25%, 50%, 75%)
            const oldPercentage = (oldAmount / goal.targetAmount) * 100;
            const newPercentage = (newAmount / goal.targetAmount) * 100;
            const milestones = [25, 50, 75];

            for (const milestone of milestones) {
              if (oldPercentage < milestone && newPercentage >= milestone) {
                // Milestone notification
                addNotification(
                  'milestone',
                  `${milestone}% Complete! 🌟`,
                  `You're ${milestone}% of the way to your "${goal.title}" goal. Keep it up!`,
                  'medium',
                  { goalId: id, goalTitle: goal.title, milestone, percentage: newPercentage },
                  '/(tabs)/portfolio'
                );
                break; // Only trigger one milestone per update
              }
            }
          }

          return { ...goal, currentAmount: newAmount };
        }
        return goal;
      });
      console.log('Goals after update:', updated);
      return updated;
    });
  };

  const clearAllGoals = async () => {
    try {
      await AsyncStorage.removeItem(GOALS_STORAGE_KEY);
      setGoals([]);
      console.log('All goals cleared');
    } catch (error) {
      console.error('Error clearing goals:', error);
    }
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        mainGoal,
        subGoals,
        addGoal,
        updateGoal,
        deleteGoal,
        setMainGoal,
        updateGoalProgress,
        clearAllGoals,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within GoalsProvider');
  }
  return context;
};
