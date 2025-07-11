
import React from 'react';
import GameNavbar from '@/components/game/GameNavbar';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameNavbar />
      
      <div className="container mx-auto px-4 py-12">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;