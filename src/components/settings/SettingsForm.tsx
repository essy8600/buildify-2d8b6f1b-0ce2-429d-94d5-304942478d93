
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const SettingsForm: React.FC = () => {
  const { user } = useAuth();
  
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email && !phone) {
      toast({
        title: "Missing fields",
        description: "Please provide either an email or phone number",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    }, 1500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully",
      });
    }, 1500);
  };

  if (!user) {
    return (
      <Card className="p-6 bg-gray-800 text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <p>Please log in to access your settings</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </div>
        
        <div className="pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </div>
        
        <div className="pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Language Preferences</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="bg-gray-700 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                toast({
                  title: "Language updated",
                  description: "Your language preference has been updated",
                });
              }}
            >
              Save Preferences
            </Button>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Domain Information</h3>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded">
              <p><strong>Domain:</strong> blogwriter.uk</p>
              <p><strong>URL:</strong> https://blogwriter.uk</p>
              <p><strong>Status:</strong> Active</p>
              <p><strong>Expiry:</strong> July 11, 2026</p>
            </div>
            
            <Button 
              variant="outline"
              onClick={() => {
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
              }}
            >
              Download Domain Receipt
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SettingsForm;