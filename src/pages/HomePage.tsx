
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GameNavbar />
      
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        {user ? (
          <GameProvider>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AviatorGame />
              </div>
              <div>
                <BettingPanel />
              </div>
            </div>
          </GameProvider>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Welcome to Aviator Bet</h1>
              <p className="text-xl text-muted-foreground">
                The exciting betting game where you control when to cash out before the plane flies away!
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link to="/login">
                <Button size="lg">Login to Play</Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">Register Now</Button>
              </Link>
            </div>
            
            <div className="mt-12 w-full max-w-3xl">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xMDUuNiAyNTEuNWMtMjEuOSAyMS45LTIxLjkgNTcuMyAwIDc5LjJsMjEuOSAyMS45YzIxLjkgMjEuOSA1Ny4zIDIxLjkgNzkuMiAwbDIxLjktMjEuOSAyOTIuMy0yOTIuM2M3LjMtNy4zIDcuMy0xOS4xIDAtMjYuNGwtMjEuOS0yMS45Yy03LjMtNy4zLTE5LjEtNy4zLTI2LjQgMEwxODAgMjgyLjdsMjEuOS0yMS45YzIxLjktMjEuOSAyMS45LTU3LjMgMC03OS4yTDE4MCAyNTkuNmwtNzQuNS03NC41LTIxLjkgMjEuOSAyMS45IDIxLjkgMjEuOS0yMS45IDUyLjYgNTIuNi01Mi42IDUyLjYtMjEuOS0yMS45eiIvPjwvc3ZnPg==" 
                alt="Aviator Plane"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
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

export default HomePage;