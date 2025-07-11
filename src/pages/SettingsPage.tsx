
import React from 'react';
import GameNavbar from '@/components/game/GameNavbar';
import SettingsForm from '@/components/settings/SettingsForm';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameNavbar />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <SettingsForm />
      </div>
    </div>
  );
};

export default SettingsPage;