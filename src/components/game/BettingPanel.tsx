
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BettingPanel: React.FC = () => {
  const { user } = useAuth();
  const { placeBet, cashout, bets, isGameRunning, currentMultiplier } = useGame();
  
  // Bet 1 state
  const [bet1Amount, setBet1Amount] = useState<string>('100');
  const [bet1AutoCashout, setBet1AutoCashout] = useState<string>('2');
  const [bet1AutoCashoutEnabled, setBet1AutoCashoutEnabled] = useState<boolean>(false);
  
  // Bet 2 state
  const [bet2Amount, setBet2Amount] = useState<string>('200');
  const [bet2AutoCashout, setBet2AutoCashout] = useState<string>('3');
  const [bet2AutoCashoutEnabled, setBet2AutoCashoutEnabled] = useState<boolean>(false);
  
  // Get current bets
  const bet1 = bets.find(bet => bet.id.endsWith('-1'));
  const bet2 = bets.find(bet => bet.id.endsWith('-2'));
  
  // Calculate potential winnings
  const getPotentialWinnings = (betAmount: string, autoCashout: string, enabled: boolean) => {
    const amount = parseFloat(betAmount) || 0;
    const cashout = enabled ? (parseFloat(autoCashout) || 0) : currentMultiplier;
    return (amount * cashout).toFixed(2);
  };

  // Handle bet 1 submission
  const handleBet1Submit = () => {
    if (!user || isGameRunning) return;
    
    const amount = parseFloat(bet1Amount);
    if (isNaN(amount) || amount <= 0) return;
    
    const autoCashout = bet1AutoCashoutEnabled ? parseFloat(bet1AutoCashout) : null;
    
    placeBet(amount, autoCashout, 1);
  };

  // Handle bet 2 submission
  const handleBet2Submit = () => {
    if (!user || isGameRunning) return;
    
    const amount = parseFloat(bet2Amount);
    if (isNaN(amount) || amount <= 0) return;
    
    const autoCashout = bet2AutoCashoutEnabled ? parseFloat(bet2AutoCashout) : null;
    
    placeBet(amount, autoCashout, 2);
  };

  // Handle cashout for bet 1
  const handleCashout1 = () => {
    if (!isGameRunning || !bet1 || bet1.status !== 'pending') return;
    cashout(1);
  };

  // Handle cashout for bet 2
  const handleCashout2 = () => {
    if (!isGameRunning || !bet2 || bet2.status !== 'pending') return;
    cashout(2);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Place Your Bets</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bet1" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bet1">Bet 1</TabsTrigger>
            <TabsTrigger value="bet2">Bet 2</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bet1" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bet1-amount">Bet Amount</Label>
                  <Input
                    id="bet1-amount"
                    type="number"
                    min="10"
                    value={bet1Amount}
                    onChange={(e) => setBet1Amount(e.target.value)}
                    disabled={isGameRunning || !!bet1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bet1-auto-cashout">Auto Cash-out</Label>
                    <Switch
                      id="bet1-auto-cashout-switch"
                      checked={bet1AutoCashoutEnabled}
                      onCheckedChange={setBet1AutoCashoutEnabled}
                      disabled={isGameRunning || !!bet1}
                    />
                  </div>
                  <Input
                    id="bet1-auto-cashout"
                    type="number"
                    min="1.1"
                    step="0.1"
                    value={bet1AutoCashout}
                    onChange={(e) => setBet1AutoCashout(e.target.value)}
                    disabled={!bet1AutoCashoutEnabled || isGameRunning || !!bet1}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Potential Win:</p>
                  <p className="text-lg font-bold">
                    {bet1 && bet1.status === 'pending'
                      ? `${(bet1.amount * currentMultiplier).toFixed(2)} KES`
                      : `${getPotentialWinnings(bet1Amount, bet1AutoCashout, bet1AutoCashoutEnabled)} KES`}
                  </p>
                </div>
                
                {bet1 && bet1.status === 'won' && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Won:</p>
                    <p className="text-lg font-bold text-green-600">
                      {bet1.winnings?.toFixed(2)} KES @ {bet1.cashoutMultiplier?.toFixed(2)}x
                    </p>
                  </div>
                )}
                
                {bet1 && bet1.status === 'lost' && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Lost:</p>
                    <p className="text-lg font-bold text-red-600">
                      {bet1.amount.toFixed(2)} KES
                    </p>
                  </div>
                )}
              </div>
              
              {!bet1 && (
                <Button 
                  onClick={handleBet1Submit} 
                  disabled={isGameRunning || !user}
                  className="w-full"
                >
                  Place Bet
                </Button>
              )}
              
              {bet1 && bet1.status === 'pending' && (
                <Button 
                  onClick={handleCashout1}
                  variant="destructive"
                  className="w-full"
                  disabled={!isGameRunning}
                >
                  Cash Out @ {currentMultiplier.toFixed(2)}x
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="bet2" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bet2-amount">Bet Amount</Label>
                  <Input
                    id="bet2-amount"
                    type="number"
                    min="10"
                    value={bet2Amount}
                    onChange={(e) => setBet2Amount(e.target.value)}
                    disabled={isGameRunning || !!bet2}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bet2-auto-cashout">Auto Cash-out</Label>
                    <Switch
                      id="bet2-auto-cashout-switch"
                      checked={bet2AutoCashoutEnabled}
                      onCheckedChange={setBet2AutoCashoutEnabled}
                      disabled={isGameRunning || !!bet2}
                    />
                  </div>
                  <Input
                    id="bet2-auto-cashout"
                    type="number"
                    min="1.1"
                    step="0.1"
                    value={bet2AutoCashout}
                    onChange={(e) => setBet2AutoCashout(e.target.value)}
                    disabled={!bet2AutoCashoutEnabled || isGameRunning || !!bet2}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Potential Win:</p>
                  <p className="text-lg font-bold">
                    {bet2 && bet2.status === 'pending'
                      ? `${(bet2.amount * currentMultiplier).toFixed(2)} KES`
                      : `${getPotentialWinnings(bet2Amount, bet2AutoCashout, bet2AutoCashoutEnabled)} KES`}
                  </p>
                </div>
                
                {bet2 && bet2.status === 'won' && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Won:</p>
                    <p className="text-lg font-bold text-green-600">
                      {bet2.winnings?.toFixed(2)} KES @ {bet2.cashoutMultiplier?.toFixed(2)}x
                    </p>
                  </div>
                )}
                
                {bet2 && bet2.status === 'lost' && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Lost:</p>
                    <p className="text-lg font-bold text-red-600">
                      {bet2.amount.toFixed(2)} KES
                    </p>
                  </div>
                )}
              </div>
              
              {!bet2 && (
                <Button 
                  onClick={handleBet2Submit} 
                  disabled={isGameRunning || !user}
                  className="w-full"
                >
                  Place Bet
                </Button>
              )}
              
              {bet2 && bet2.status === 'pending' && (
                <Button 
                  onClick={handleCashout2}
                  variant="destructive"
                  className="w-full"
                  disabled={!isGameRunning}
                >
                  Cash Out @ {currentMultiplier.toFixed(2)}x
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BettingPanel;