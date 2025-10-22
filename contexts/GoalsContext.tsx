import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavingsGoal } from '../types';

interface GoalsContextType {
  goals: SavingsGoal[];
  mainGoal: SavingsGoal | null;
  subGoals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  setMainGoal: (id: string) => void;
  updateGoalProgress: (id: string, amount: number) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

const GOALS_STORAGE_KEY = '@stacksave_goals';

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
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
        // Convert date strings back to Date objects
        const goalsWithDates = parsedGoals.map((goal: any) => ({
          ...goal,
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
    setGoals((prev) => [...prev, newGoal]);
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
          const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
          console.log('Updating goal:', {
            goalId: id,
            oldAmount: goal.currentAmount,
            addingAmount: amount,
            newAmount,
            targetAmount: goal.targetAmount,
          });
          return { ...goal, currentAmount: newAmount };
        }
        return goal;
      });
      console.log('Goals after update:', updated);
      return updated;
    });
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
