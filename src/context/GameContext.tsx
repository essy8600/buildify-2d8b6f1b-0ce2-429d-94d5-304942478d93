
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, Bet } from '@/types';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface GameContextType {
  gameState: GameState;
  bet1: Bet | null;
  bet2: Bet | null;
  placeBet: (amount: number, autoCashout: number | null, betNumber: 1 | 2) => void;
  cashout: (betNumber: 1 | 2) => void;
  resetBets: () => void;
  history: number[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateBalance } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    currentMultiplier: 1.00,
    crashPoint: 0,
    countdown: 30,
    round: 1,
  });
  const [bet1, setBet1] = useState<Bet | null>(null);
  const [bet2, setBet2] = useState<Bet | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);

  // Calculate crash point based on round number
  const calculateCrashPoint = (round: number): number => {
    if (round <= 10) return 20;
    if (round <= 20) return 60;
    if (round <= 30) return 200;
    if (round <= 40) return 600;
    return 1000;
  };

  // Start countdown for next round
  const startCountdown = () => {
    setGameState(prev => ({
      ...prev,
      status: 'waiting',
      currentMultiplier: 1.00,
      countdown: 30
    }));

    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.countdown <= 1) {
          clearInterval(interval);
          startGame();
          return {
            ...prev,
            countdown: 0,
            status: 'flying'
          };
        }
        return {
          ...prev,
          countdown: prev.countdown - 1
        };
      });
    }, 1000);

    setTimer(interval);
  };

  // Start the game (plane flying)
  const startGame = () => {
    // Set crash point for this round
    const crashPoint = calculateCrashPoint(gameState.round);
    
    setGameState(prev => ({
      ...prev,
      crashPoint,
      status: 'flying',
      currentMultiplier: 1.00
    }));

    // Increase multiplier over time
    const interval = setInterval(() => {
      setGameState(prev => {
        // Check for auto cashouts
        if (bet1 && bet1.active && bet1.autoCashout && prev.currentMultiplier >= bet1.autoCashout) {
          cashout(1);
        }
        
        if (bet2 && bet2.active && bet2.autoCashout && prev.currentMultiplier >= bet2.autoCashout) {
          cashout(2);
        }

        // Check if we've reached the crash point
        if (prev.currentMultiplier >= prev.crashPoint) {
          clearInterval(interval);
          handleCrash();
          return {
            ...prev,
            status: 'crashed',
            currentMultiplier: prev.crashPoint
          };
        }

        // Increase multiplier (faster as it gets higher)
        const increment = prev.currentMultiplier * 0.05;
        return {
          ...prev,
          currentMultiplier: parseFloat((prev.currentMultiplier + increment).toFixed(2))
        };
      });
    }, 100); // Update every 100ms for smooth animation

    setGameInterval(interval);
  };

  // Handle game crash
  const handleCrash = () => {
    // Add to history
    setHistory(prev => [gameState.crashPoint, ...prev].slice(0, 10));
    
    // Handle any active bets as lost
    if (bet1 && bet1.active) {
      setBet1(prev => prev ? { ...prev, active: false, cashedOut: false } : null);
    }
    
    if (bet2 && bet2.active) {
      setBet2(prev => prev ? { ...prev, active: false, cashedOut: false } : null);
    }

    // Move to next round after a short delay
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        round: prev.round + 1,
      }));
      startCountdown();
    }, 3000);
  };

  // Place a bet
  const placeBet = (amount: number, autoCashout: number | null, betNumber: 1 | 2) => {
    if (!user || gameState.status !== 'waiting') return;
    
    // Check if user has enough balance
    if (user.balance < amount) return;
    
    const newBet: Bet = {
      id: uuidv4(),
      amount,
      autoCashout,
      potentialWin: 0, // Will be calculated based on cashout
      active: true,
      cashedOut: false,
      cashoutMultiplier: null,
      winAmount: null
    };
    
    if (betNumber === 1) {
      setBet1(newBet);
    } else {
      setBet2(newBet);
    }
    
    // Deduct from balance
    updateBalance(-amount);
  };

  // Cash out a bet
  const cashout = (betNumber: 1 | 2) => {
    const currentBet = betNumber === 1 ? bet1 : bet2;
    if (!currentBet || !currentBet.active || gameState.status !== 'flying') return;
    
    const winAmount = currentBet.amount * gameState.currentMultiplier;
    
    if (betNumber === 1) {
      setBet1({
        ...currentBet,
        active: false,
        cashedOut: true,
        cashoutMultiplier: gameState.currentMultiplier,
        winAmount
      });
    } else {
      setBet2({
        ...currentBet,
        active: false,
        cashedOut: true,
        cashoutMultiplier: gameState.currentMultiplier,
        winAmount
      });
    }
    
    // Add winnings to balance
    updateBalance(winAmount);
    
    // If both bets are cashed out, end the round
    const otherBet = betNumber === 1 ? bet2 : bet1;
    if (!otherBet || !otherBet.active) {
      if (gameInterval) clearInterval(gameInterval);
      if (timer) clearInterval(timer);
      
      // Move to next round
      setGameState(prev => ({
        ...prev,
        status: 'crashed',
        round: prev.round + 1,
      }));
      
      setTimeout(() => {
        startCountdown();
      }, 2000);
    }
  };

  // Reset bets for new round
  const resetBets = () => {
    setBet1(null);
    setBet2(null);
  };

  // Start the game when component mounts
  useEffect(() => {
    startCountdown();
    
    // Cleanup intervals on unmount
    return () => {
      if (timer) clearInterval(timer);
      if (gameInterval) clearInterval(gameInterval);
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        bet1,
        bet2,
        placeBet,
        cashout,
        resetBets,
        history
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};