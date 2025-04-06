
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, signIn as authSignIn, signOut as authSignOut, signUp as authSignUp, UserCredentials } from '@/lib/auth';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  signIn: (credentials: UserCredentials) => Promise<any | null>;
  signUp: (credentials: UserCredentials) => Promise<any | null>;
  signOut: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for current session
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to get current user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Try to set up auth listener if Supabase is configured
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      subscription = data.subscription;
    } catch (error) {
      console.error('Failed to set up auth listener:', error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (credentials: UserCredentials) => {
    try {
      return await authSignIn(credentials);
    } catch (error) {
      console.error('Error in signIn:', error);
      return null;
    }
  };

  const signUp = async (credentials: UserCredentials) => {
    try {
      return await authSignUp(credentials);
    } catch (error) {
      console.error('Error in signUp:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      return await authSignOut();
    } catch (error) {
      console.error('Error in signOut:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
