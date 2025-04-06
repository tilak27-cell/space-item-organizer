
import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

export interface UserCredentials {
  email: string;
  password: string;
}

export async function signUp({ email, password }: UserCredentials) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Signup Successful",
      description: "Please check your email for verification",
    });
    
    return data.user;
  } catch (error) {
    console.error('Error signing up:', error);
    return null;
  }
}

export async function signIn({ email, password }: UserCredentials) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Login Successful",
      description: `Welcome back, ${data.user.email}`,
    });
    
    return data.user;
  } catch (error) {
    console.error('Error signing in:', error);
    return null;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out",
    });
    
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
