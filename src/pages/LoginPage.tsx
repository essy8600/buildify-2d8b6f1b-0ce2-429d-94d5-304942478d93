
import React from 'react';
import GameNavbar from '@/components/game/GameNavbar';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GameNavbar />
      
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6 flex items-center justify-center">
        <LoginForm />
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

export default LoginPage;