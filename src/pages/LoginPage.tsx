
import React from 'react';
import GameNavbar from '@/components/game/GameNavbar';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameNavbar />
      
      <div className="container mx-auto px-4 py-12">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;