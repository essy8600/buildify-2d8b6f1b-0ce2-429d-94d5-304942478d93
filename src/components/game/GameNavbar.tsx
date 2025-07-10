
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const GameNavbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="font-bold text-2xl mr-6 flex items-center">
          <span className="text-red-600">Aviator</span>
          <span className="ml-1">Bet</span>
        </Link>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            {user && (
              <>
                <NavigationMenuItem>
                  <Link to="/wallet">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Wallet
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/settings">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Settings
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <div className="hidden md:block">
                <div className="text-sm text-muted-foreground">Balance</div>
                <div className="font-medium">{user.balance.toFixed(2)} KES</div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameNavbar;