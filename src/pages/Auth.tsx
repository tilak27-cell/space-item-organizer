
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const user = await signIn({ email, password });
      if (user) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${email}`,
        });
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    
    try {
      const user = await signUp({ email, password });
      if (user) {
        toast({
          title: "Signup Successful",
          description: "Please check your email for verification",
        });
      } else {
        setError('Failed to create account');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-space-darker-blue">
      <Card className="w-full max-w-md bg-space-dark-blue border-gray-800">
        <Tabs defaultValue="login">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Space Cargo Management</CardTitle>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </div>
            <CardDescription>
              Manage your space cargo efficiently
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-md mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-space-darker-blue border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-space-darker-blue border-gray-700"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-space-blue hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium">Email</label>
                    <Input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-space-darker-blue border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium">Password</label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-space-darker-blue border-gray-700"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-space-blue hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-gray-400">
              Space Cargo Management System &copy; {new Date().getFullYear()}
            </p>
            <div className="text-xs text-center text-gray-500 w-full">
              <p>To test the application, create a new account or use these credentials:</p>
              <p className="font-mono mt-1">demo@spacecargo.com / spacecargo123</p>
            </div>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
