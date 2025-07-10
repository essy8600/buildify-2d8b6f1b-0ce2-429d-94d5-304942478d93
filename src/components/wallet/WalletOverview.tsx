
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const WalletOverview: React.FC = () => {
  const { user, addBonus } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositProvider, setDepositProvider] = useState('mpesa');
  const [withdrawProvider, setWithdrawProvider] = useState('pesapal');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate USSD push
    toast({
      title: "USSD Push Sent",
      description: `A payment request of ${amount} KES has been sent to ${phoneNumber}. Please check your phone to complete the transaction.`,
    });
  };
  
  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!user || user.balance < amount) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate withdrawal request
    toast({
      title: "Withdrawal Requested",
      description: `Your withdrawal request of ${amount} KES via ${withdrawProvider} has been submitted and is being processed.`,
    });
  };
  
  const handleClaimBonus = () => {
    addBonus();
    toast({
      title: "Bonus Claimed!",
      description: "You have successfully claimed a bonus of 18,000 KES!",
    });
  };
  
  const handleDownloadReceipt = () => {
    // Create a simple receipt
    const receipt = `
      ===== DOMAIN RECEIPT =====
      Domain: blogwriter.uk
      URL: https://blogwriter.uk
      Date: ${new Date().toLocaleDateString()}
      Time: ${new Date().toLocaleTimeString()}
      ========================
    `;
    
    // Create a blob and download
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domain_receipt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt Downloaded",
      description: "Domain receipt has been downloaded successfully.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>Manage your funds and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.balance.toFixed(2)} KES</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bonus Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.bonus.toFixed(2)} KES</div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleClaimBonus}
              >
                Claim 100% Bonus (18,000 KES)
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Domain Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">blogwriter.uk</div>
              <div className="text-xs text-muted-foreground">https://blogwriter.uk</div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleDownloadReceipt}
              >
                Download Receipt
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deposit-amount">Amount (KES)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  min="100"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="e.g. 0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="deposit-provider">Payment Method</Label>
                <Select 
                  value={depositProvider} 
                  onValueChange={setDepositProvider}
                >
                  <SelectTrigger id="deposit-provider">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mpesa">M-PESA</SelectItem>
                    <SelectItem value="airtel">Airtel Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleDeposit}>Deposit Now</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="withdraw-amount">Amount (KES)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  min="100"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="withdraw-provider">Withdrawal Method</Label>
                <Select 
                  value={withdrawProvider} 
                  onValueChange={setWithdrawProvider}
                >
                  <SelectTrigger id="withdraw-provider">
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pesapal">PesaPal</SelectItem>
                    <SelectItem value="intasend">IntaSend</SelectItem>
                    <SelectItem value="mpesa">M-PESA</SelectItem>
                    <SelectItem value="airtel">Airtel Money</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleWithdraw}>Request Withdrawal</Button>
              
              <div className="text-sm text-muted-foreground">
                <p>Note: Withdrawals are processed within 24 hours. Minimum withdrawal amount is 100 KES.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WalletOverview;