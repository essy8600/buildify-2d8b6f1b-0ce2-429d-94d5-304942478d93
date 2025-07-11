
export interface User {
  id: string;
  email?: string;
  phone?: string;
  balance: number;
  bonus: number;
  pendingWithdrawals: number;
}

export interface Bet {
  id: string;
  amount: number;
  autoCashout: number | null;
  potentialWin: number;
  active: boolean;
  cashedOut: boolean;
  cashoutMultiplier: number | null;
  winAmount: number | null;
}

export interface GameState {
  status: 'waiting' | 'flying' | 'crashed';
  currentMultiplier: number;
  crashPoint: number;
  countdown: number;
  round: number;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  provider: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
}

export interface DepositRequest {
  id: string;
  amount: number;
  provider: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
}

export interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
}