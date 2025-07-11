
import React from 'react';
import { GameProvider } from '@/context/GameContext';
import GameNavbar from '@/components/game/GameNavbar';
import AviatorGame from '@/components/game/AviatorGame';
import BettingPanel from '@/components/game/BettingPanel';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameNavbar />
      
      <div className="container mx-auto px-4 py-6">
        {user ? (
          <GameProvider>
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Aviator Game</h1>
              
              <AviatorGame />
              
              <BettingPanel />
            </div>
          </GameProvider>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <h1 className="text-3xl font-bold text-center">Welcome to Aviator</h1>
            <p className="text-center max-w-md">
              Experience the thrill of the Aviator game! Place your bets and cash out before the plane flies away.
            </p>
            
            <div className="flex space-x-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/register">Register</Link>
              </Button>
            </div>
            
            <div className="mt-8 w-full max-w-2xl">
              <img 
                src="/placeholder.svg" 
                alt="Aviator Game Preview" 
                className="w-full h-64 object-cover rounded-lg opacity-70"
              />
              <p className="text-center mt-4 text-gray-400">
                Login or register to start playing and winning!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;