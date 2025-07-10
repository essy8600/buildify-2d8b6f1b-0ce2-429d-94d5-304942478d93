
export interface User {
  id: string;
  email?: string;
  phone?: string;
  balance: number;
  bonus: number;
}

export interface Bet {
  id: string;
  amount: number;
  autoCashout: number | null;
  userId: string;
  gameId: string;
  status: 'pending' | 'won' | 'lost';
  cashoutMultiplier?: number;
  winnings?: number;
  createdAt: Date;
}

export interface Game {
  id: string;
  crashPoint: number;
  startedAt: Date;
  endedAt?: Date;
  status: 'waiting' | 'running' | 'finished';
  round: number;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  provider: string;
  createdAt: Date;
}

export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  provider: string;
  createdAt: Date;
}