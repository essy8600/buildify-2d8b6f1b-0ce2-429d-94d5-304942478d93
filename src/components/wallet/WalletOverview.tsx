
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const paymentProviders = [
  { id: 'mpesa', name: 'M-PESA', logo: '📱' },
  { id: 'airtel', name: 'Airtel Money', logo: '📲' },
  { id: 'pesapal', name: 'PesaPal', logo: '💳' },
  { id: 'intasend', name: 'IntaSend', logo: '💸' },
  { id: 'paypal', name: 'PayPal', logo: '💰' },
  { id: 'visa', name: 'Visa', logo: '💳' },
  { id: 'mastercard', name: 'Mastercard', logo: '💳' },
];

const WalletOverview: React.FC = () => {
  const { user, updateBalance, claimBonus } = useAuth();
  const [depositAmount, setDepositAmount] = useState<string>('1000');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [selectedDepositProvider, setSelectedDepositProvider] = useState<string>('mpesa');
  const [selectedWithdrawProvider, setSelectedWithdrawProvider] = useState<string>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const handleDeposit = () => {
    if (!user) return;
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate USSD push
    setTimeout(() => {
      toast({
        title: "USSD Push Sent",
        description: `Check your phone ${phoneNumber} for the payment prompt`,
      });
      
      // Simulate successful payment after 3 seconds
      setTimeout(() => {
        updateBalance(amount);
        setIsProcessing(false);
        toast({
          title: "Deposit Successful",
          description: `KES ${amount.toFixed(2)} has been added to your account`,
          variant: "success"
        });
      }, 3000);
    }, 2000);
  };
  
  const handleWithdraw = () => {
    if (!user) return;
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > user.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call to PesaPal
    setTimeout(() => {
      updateBalance(-amount);
      setIsProcessing(false);
      toast({
        title: "Withdrawal Initiated",
        description: `KES ${amount.toFixed(2)} will be sent to your ${
          paymentProviders.find(p => p.id === selectedWithdrawProvider)?.name
        } account`,
        variant: "success"
      });
    }, 3000);
  };
  
  const handleClaimBonus = () => {
    if (!user) return;
    
    claimBonus();
    toast({
      title: "Bonus Claimed",
      description: "KES 18,000 bonus has been added to your account",
      variant: "success"
    });
  };
  
  const handleDownloadReceipt = () => {
    // Create a simple receipt as a blob
    const receiptContent = `
      DOMAIN RECEIPT
      ==============
      
      Domain: blogwriter.uk
      URL: https://blogwriter.uk
      Owner: ${user?.email || 'User'}
      Date: July 11, 2025
      
      This document certifies the ownership of the above domain.
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domain_receipt.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt Downloaded",
      description: "Domain receipt has been downloaded successfully",
    });
  };

  if (!user) {
    return (
      <Card className="p-6 bg-gray-800 text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Wallet</h2>
          <p>Please log in to access your wallet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gray-800 text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Wallet</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gray-700">
            <h3 className="text-sm text-gray-400">Available Balance</h3>
            <p className="text-2xl font-bold">{user.balance.toFixed(2)} KES</p>
          </Card>
          
          <Card className="p-4 bg-gray-700">
            <h3 className="text-sm text-gray-400">Bonus Available</h3>
            <p className="text-2xl font-bold">{user.bonus > 0 ? `${user.bonus.toFixed(2)} KES` : '0.00 KES'}</p>
            {user.bonus === 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={handleClaimBonus}
              >
                Claim 18,000 KES Bonus
              </Button>
            )}
          </Card>
          
          <Card className="p-4 bg-gray-700">
            <h3 className="text-sm text-gray-400">Pending Withdrawals</h3>
            <p className="text-2xl font-bold">{user.pendingWithdrawals.toFixed(2)} KES</p>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposit" className="space-y-4">
          <div>
            <Label htmlFor="deposit-amount">Amount (KES)</Label>
            <Input
              id="deposit-amount"
              type="number"
              min="100"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="bg-gray-700 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="deposit-provider">Payment Method</Label>
            <Select 
              value={selectedDepositProvider} 
              onValueChange={setSelectedDepositProvider}
            >
              <SelectTrigger id="deposit-provider" className="bg-gray-700 text-white">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentProviders.slice(0, 2).map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{provider.logo}</span>
                      <span>{provider.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input
              id="phone-number"
              type="tel"
              placeholder="e.g. 0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-gray-700 text-white"
            />
          </div>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleDeposit}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Deposit Now'}
          </Button>
        </TabsContent>
        
        <TabsContent value="withdraw" className="space-y-4">
          <div>
            <Label htmlFor="withdraw-amount">Amount (KES)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              min="100"
              max={user.balance.toString()}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="bg-gray-700 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="withdraw-provider">Withdrawal Method</Label>
            <Select 
              value={selectedWithdrawProvider} 
              onValueChange={setSelectedWithdrawProvider}
            >
              <SelectTrigger id="withdraw-provider" className="bg-gray-700 text-white">
                <SelectValue placeholder="Select withdrawal method" />
              </SelectTrigger>
              <SelectContent>
                {paymentProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{provider.logo}</span>
                      <span>{provider.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleWithdraw}
            disabled={isProcessing || user.balance <= 0}
          >
            {isProcessing ? 'Processing...' : 'Withdraw Now'}
          </Button>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-bold mb-4">Additional Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                PesaPal API Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>PesaPal API Integration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Consumer Key</Label>
                  <Input 
                    value="YzQpA6FPAG4dV7UizQOuzCgWhba4HGWW" 
                    readOnly 
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label>Consumer Secret</Label>
                  <Input 
                    value="ZtuIsIueBNpjj3+cy3gN8lTUnd4=" 
                    readOnly 
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label>Endpoint</Label>
                  <Input 
                    value="https://www.pesapal.com/" 
                    readOnly 
                    className="bg-gray-700 text-white"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  This integration allows for instant withdrawals to your PesaPal account.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleDownloadReceipt}
          >
            Download Domain Receipt
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WalletOverview;