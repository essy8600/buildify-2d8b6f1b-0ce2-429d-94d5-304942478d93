
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Game, Bet } from '@/types';
import { useAuth } from './AuthContext';

interface GameContextType {
  game: Game | null;
  bets: Bet[];
  currentMultiplier: number;
  isGameRunning: boolean;
  roundNumber: number;
  placeBet: (amount: number, autoCashout: number | null, betNumber: 1 | 2) => void;
  cashout: (betNumber: 1 | 2) => void;
  resetBets: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateBalance } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [crashPoint, setCrashPoint] = useState(0);
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(30);

  // Determine crash point based on round number
  useEffect(() => {
    let newCrashPoint = 0;
    if (roundNumber >= 1 && roundNumber <= 10) {
      newCrashPoint = 20;
    } else if (roundNumber >= 11 && roundNumber <= 20) {
      newCrashPoint = 60;
    } else if (roundNumber >= 21 && roundNumber <= 30) {
      newCrashPoint = 200;
    } else if (roundNumber >= 31 && roundNumber <= 40) {
      newCrashPoint = 600;
    } else if (roundNumber >= 41 && roundNumber <= 50) {
      newCrashPoint = 1000;
    } else {
      // Reset to first round pattern after 50 rounds
      newCrashPoint = 20;
    }
    setCrashPoint(newCrashPoint);
  }, [roundNumber]);

  // Start countdown for next game
  const startCountdown = () => {
    setCountdown(30);
    setIsGameRunning(false);
    setCurrentMultiplier(1);
    
    if (countdownInterval) clearInterval(countdownInterval);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setCountdownInterval(interval);
  };

  // Start the game
  const startGame = () => {
    setIsGameRunning(true);
    setCurrentMultiplier(1);
    
    const newGame: Game = {
      id: Math.random().toString(),
      crashPoint: crashPoint,
      startedAt: new Date(),
      status: 'running',
      round: roundNumber,
    };
    
    setGame(newGame);
    
    if (gameInterval) clearInterval(gameInterval);
    
    // Increase multiplier over time
    const interval = setInterval(() => {
      setCurrentMultiplier(prev => {
        const newMultiplier = parseFloat((prev * 1.05).toFixed(2));
        
        // Check for auto cashouts
        bets.forEach(bet => {
          if (bet.status === 'pending' && bet.autoCashout && newMultiplier >= bet.autoCashout) {
            cashoutBet(bet.id, newMultiplier);
          }
        });
        
        // Check if we've reached the crash point
        if (newMultiplier >= crashPoint) {
          endGame();
          return crashPoint;
        }
        
        return newMultiplier;
      });
    }, 100); // Update every 100ms for smoother animation
    
    setGameInterval(interval);
  };

  // End the game
  const endGame = () => {
    if (gameInterval) clearInterval(gameInterval);
    
    // Mark all pending bets as lost
    const updatedBets = bets.map(bet => 
      bet.status === 'pending' ? { ...bet, status: 'lost' } : bet
    );
    
    setBets(updatedBets);
    
    if (game) {
      setGame({
        ...game,
        status: 'finished',
        endedAt: new Date(),
      });
    }
    
    // Increment round number
    setRoundNumber(prev => (prev % 50) + 1);
    
    // Start countdown for next game
    setTimeout(() => {
      startCountdown();
    }, 3000); // Show crash for 3 seconds before starting countdown
  };

  // Place a bet
  const placeBet = (amount: number, autoCashout: number | null, betNumber: 1 | 2) => {
    if (!user || isGameRunning) return;
    
    // Check if user has enough balance
    if (user.balance < amount) return;
    
    // Check if user already has a bet with this number
    const existingBetIndex = bets.findIndex(
      bet => bet.userId === user.id && bet.id.endsWith(`-${betNumber}`)
    );
    
    if (existingBetIndex !== -1) {
      // Replace existing bet
      const updatedBets = [...bets];
      updatedBets.splice(existingBetIndex, 1);
      setBets(updatedBets);
    }
    
    // Create new bet
    const newBet: Bet = {
      id: `${user.id}-${betNumber}`,
      amount,
      autoCashout,
      userId: user.id,
      gameId: game?.id || 'waiting',
      status: 'pending',
      createdAt: new Date(),
    };
    
    setBets([...bets, newBet]);
    
    // Deduct amount from user balance
    updateBalance(user.balance - amount);
  };

  // Cash out a bet
  const cashout = (betNumber: 1 | 2) => {
    if (!user || !isGameRunning) return;
    
    const betId = `${user.id}-${betNumber}`;
    cashoutBet(betId, currentMultiplier);
  };

  // Helper function to process cashout
  const cashoutBet = (betId: string, multiplier: number) => {
    const betIndex = bets.findIndex(bet => bet.id === betId && bet.status === 'pending');
    
    if (betIndex === -1) return;
    
    const bet = bets[betIndex];
    const winnings = bet.amount * multiplier;
    
    // Update bet
    const updatedBets = [...bets];
    updatedBets[betIndex] = {
      ...bet,
      status: 'won',
      cashoutMultiplier: multiplier,
      winnings,
    };
    
    setBets(updatedBets);
    
    // Add winnings to user balance
    if (user) {
      updateBalance(user.balance + winnings);
    }
    
    // If all bets are cashed out, end the game
    const pendingBets = updatedBets.filter(b => b.status === 'pending' && b.userId === user?.id);
    if (pendingBets.length === 0 && user) {
      endGame();
    }
  };

  // Reset bets for a new game
  const resetBets = () => {
    setBets([]);
  };

  // Start the initial countdown when component mounts
  useEffect(() => {
    startCountdown();
    
    return () => {
      if (gameInterval) clearInterval(gameInterval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        game,
        bets,
        currentMultiplier,
        isGameRunning,
        roundNumber,
        placeBet,
        cashout,
        resetBets,
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