
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
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: UserCredentials) => {
    return await authSignIn(credentials);
  };

  const signUp = async (credentials: UserCredentials) => {
    return await authSignUp(credentials);
  };

  const signOut = async () => {
    return await authSignOut();
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
