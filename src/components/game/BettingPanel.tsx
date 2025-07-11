
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const BettingPanel: React.FC = () => {
  const { gameState, bet1, bet2, placeBet, cashout } = useGame();
  const { user } = useAuth();
  
  // Bet 1 state
  const [bet1Amount, setBet1Amount] = useState<string>('100');
  const [bet1AutoCashout, setBet1AutoCashout] = useState<string>('2.00');
  const [bet1UseAutoCashout, setBet1UseAutoCashout] = useState<boolean>(false);
  
  // Bet 2 state
  const [bet2Amount, setBet2Amount] = useState<string>('200');
  const [bet2AutoCashout, setBet2AutoCashout] = useState<string>('3.00');
  const [bet2UseAutoCashout, setBet2UseAutoCashout] = useState<boolean>(false);

  const handlePlaceBet = (betNumber: 1 | 2) => {
    if (!user) return;
    
    const amount = betNumber === 1 
      ? parseFloat(bet1Amount) 
      : parseFloat(bet2Amount);
      
    const autoCashout = betNumber === 1
      ? (bet1UseAutoCashout ? parseFloat(bet1AutoCashout) : null)
      : (bet2UseAutoCashout ? parseFloat(bet2AutoCashout) : null);
    
    if (isNaN(amount) || amount <= 0) return;
    if (autoCashout !== null && (isNaN(autoCashout) || autoCashout < 1.01)) return;
    
    placeBet(amount, autoCashout, betNumber);
  };

  const handleCashout = (betNumber: 1 | 2) => {
    cashout(betNumber);
  };

  const calculatePotentialWin = (betAmount: string, multiplier: string): string => {
    const amount = parseFloat(betAmount);
    const multi = parseFloat(multiplier);
    
    if (isNaN(amount) || isNaN(multi)) return '0.00';
    
    return (amount * multi).toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Bet 1 */}
      <Card className="p-4 bg-gray-800 text-white">
        <h3 className="text-lg font-bold mb-2">Bet 1</h3>
        
        {bet1 && bet1.active ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Bet Amount:</span>
              <span>{bet1.amount.toFixed(2)} KES</span>
            </div>
            
            {bet1.autoCashout && (
              <div className="flex justify-between">
                <span>Auto Cashout:</span>
                <span>{bet1.autoCashout.toFixed(2)}x</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold">
              <span>Potential Win:</span>
              <span>{(bet1.amount * gameState.currentMultiplier).toFixed(2)} KES</span>
            </div>
            
            {gameState.status === 'flying' && (
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => handleCashout(1)}
              >
                Cash Out @ {gameState.currentMultiplier.toFixed(2)}x
              </Button>
            )}
          </div>
        ) : bet1 && bet1.cashedOut ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Bet Amount:</span>
              <span>{bet1.amount.toFixed(2)} KES</span>
            </div>
            
            <div className="flex justify-between font-bold text-green-400">
              <span>Cashed Out:</span>
              <span>{bet1.cashoutMultiplier?.toFixed(2)}x</span>
            </div>
            
            <div className="flex justify-between font-bold text-green-400">
              <span>Won:</span>
              <span>{bet1.winAmount?.toFixed(2)} KES</span>
            </div>
            
            <div className="p-3 bg-green-900 bg-opacity-50 rounded text-center">
              Successfully cashed out!
            </div>
          </div>
        ) : bet1 ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Bet Amount:</span>
              <span>{bet1.amount.toFixed(2)} KES</span>
            </div>
            
            <div className="flex justify-between font-bold text-red-400">
              <span>Result:</span>
              <span>Lost</span>
            </div>
            
            <div className="p-3 bg-red-900 bg-opacity-50 rounded text-center">
              Plane crashed at {gameState.crashPoint.toFixed(2)}x
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bet1-amount">Bet Amount (KES)</Label>
              <Input
                id="bet1-amount"
                type="number"
                min="10"
                value={bet1Amount}
                onChange={(e) => setBet1Amount(e.target.value)}
                className="bg-gray-700 text-white"
                disabled={gameState.status !== 'waiting'}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="bet1-auto"
                checked={bet1UseAutoCashout}
                onCheckedChange={setBet1UseAutoCashout}
                disabled={gameState.status !== 'waiting'}
              />
              <Label htmlFor="bet1-auto">Auto Cashout</Label>
            </div>
            
            {bet1UseAutoCashout && (
              <div>
                <Label htmlFor="bet1-cashout">Auto Cashout at (x)</Label>
                <Input
                  id="bet1-cashout"
                  type="number"
                  min="1.01"
                  step="0.01"
                  value={bet1AutoCashout}
                  onChange={(e) => setBet1AutoCashout(e.target.value)}
                  className="bg-gray-700 text-white"
                  disabled={gameState.status !== 'waiting'}
                />
              </div>
            )}
            
            <div className="flex justify-between font-bold">
              <span>Potential Win:</span>
              <span>
                {bet1UseAutoCashout 
                  ? calculatePotentialWin(bet1Amount, bet1AutoCashout)
                  : '?'} KES
              </span>
            </div>
            
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => handlePlaceBet(1)}
              disabled={gameState.status !== 'waiting' || !user}
            >
              Place Bet
            </Button>
          </div>
        )}
      </Card>
      
      {/* Bet 2 */}
      <Card className="p-4 bg-gray-800 text-white">
        <h3 className="text-lg font-bold mb-2">Bet 2</h3>
        
        {bet2 && bet2.active ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Bet Amount:</span>
              <span>{bet2.amount.toFixed(2)} KES</span>
            </div>
            
            {bet2.autoCashout && (
              <div className="flex justify-between">
                <span>Auto Cashout:</span>
                <span>{bet2.autoCashout.toFixed(2)}x</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold">
              <span>Potential Win:</span>
              <span>{(bet2.amount * gameState.currentMultiplier).toFixed(2)} KES</span>
            </div>
            
            {gameState.status === 'flying' && (
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => handleCashout(2)}
              >
                Cash Out @ {gameState.currentMultiplier.toFixed(2)}x
              </Button>
            )}
          </div>
        ) : bet2 && bet2.cashedOut ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Bet Amount:</span>
              <span>{bet2.amount.toFixed(2)} KES</span>
            </div>
            
            <div className="flex justify-between font-bold text-green-400">
              <span>Cashed Out:</span>
              <span>{bet2.cashoutMultiplier?.toFixed(2)}x</span>
            </div>
            
            <div className="flex justify-between font-bold text-green-400">
              <span>Won:</span>
              <span>{bet2.winAmount?.toFixed(2)} KES</span>
            </div>
            
            <div className="p-3 bg-green-900 bg-opacity-50 rounded text-center">
              Successfully cashed out!
            </div>
          </div>
        ) : bet2 ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Bet Amount:</span>
              <span>{bet2.amount.toFixed(2)} KES</span>
            </div>
            
            <div className="flex justify-between font-bold text-red-400">
              <span>Result:</span>
              <span>Lost</span>
            </div>
            
            <div className="p-3 bg-red-900 bg-opacity-50 rounded text-center">
              Plane crashed at {gameState.crashPoint.toFixed(2)}x
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bet2-amount">Bet Amount (KES)</Label>
              <Input
                id="bet2-amount"
                type="number"
                min="10"
                value={bet2Amount}
                onChange={(e) => setBet2Amount(e.target.value)}
                className="bg-gray-700 text-white"
                disabled={gameState.status !== 'waiting'}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="bet2-auto"
                checked={bet2UseAutoCashout}
                onCheckedChange={setBet2UseAutoCashout}
                disabled={gameState.status !== 'waiting'}
              />
              <Label htmlFor="bet2-auto">Auto Cashout</Label>
            </div>
            
            {bet2UseAutoCashout && (
              <div>
                <Label htmlFor="bet2-cashout">Auto Cashout at (x)</Label>
                <Input
                  id="bet2-cashout"
                  type="number"
                  min="1.01"
                  step="0.01"
                  value={bet2AutoCashout}
                  onChange={(e) => setBet2AutoCashout(e.target.value)}
                  className="bg-gray-700 text-white"
                  disabled={gameState.status !== 'waiting'}
                />
              </div>
            )}
            
            <div className="flex justify-between font-bold">
              <span>Potential Win:</span>
              <span>
                {bet2UseAutoCashout 
                  ? calculatePotentialWin(bet2Amount, bet2AutoCashout)
                  : '?'} KES
              </span>
            </div>
            
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => handlePlaceBet(2)}
              disabled={gameState.status !== 'waiting' || !user}
            >
              Place Bet
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BettingPanel;