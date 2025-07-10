
import React from 'react';
import GameNavbar from '@/components/game/GameNavbar';
import SettingsForm from '@/components/settings/SettingsForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GameNavbar />
      
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <SettingsForm />
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Aviator Bet. All rights reserved.
            </div>
            <div className="text-sm text-muted-foreground">
              <a href="https://blogwriter.uk" className="hover:underline">blogwriter.uk</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SettingsPage;