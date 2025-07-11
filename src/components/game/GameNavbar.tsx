
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Wallet, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';

const GameNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-gray-900 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Aviator</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex flex-col items-center text-xs"
                asChild
              >
                <Link to="/">
                  <Home className="h-5 w-5 mb-1" />
                  Home
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="flex flex-col items-center text-xs"
                asChild
              >
                <Link to="/wallet">
                  <Wallet className="h-5 w-5 mb-1" />
                  Wallet
                  {user && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">
                      {user.balance.toFixed(0)}
                    </span>
                  )}
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="flex flex-col items-center text-xs"
                asChild
              >
                <Link to="/settings">
                  <Settings className="h-5 w-5 mb-1" />
                  Settings
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="flex flex-col items-center text-xs"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mb-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex flex-col items-center text-xs"
                asChild
              >
                <Link to="/login">
                  <User className="h-5 w-5 mb-1" />
                  Login
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameNavbar;