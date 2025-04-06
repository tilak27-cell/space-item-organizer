
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const SupabaseStatus = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error' | 'missing-env'>('loading');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if environment variables are set
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.error('Missing Supabase environment variables');
          setStatus('missing-env');
          toast({
            title: "Missing Configuration",
            description: "Supabase URL and Anon Key are required in .env.local file",
            variant: "destructive"
          });
          return;
        }

        // Simple query to test connection
        const { data, error } = await supabase.from('cargo_items').select('count()', { count: 'exact' }).limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setStatus('error');
          toast({
            title: "Database Connection Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          console.log('Supabase connected successfully:', data);
          setStatus('connected');
          toast({
            title: "Database Connected",
            description: "Successfully connected to Supabase database"
          });
        }
      } catch (err) {
        console.error('Error checking connection:', err);
        setStatus('error');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 bg-space-dark-blue rounded-lg border border-gray-800 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Database Status</h3>
          <p className="text-sm text-gray-400">
            {status === 'loading' && 'Checking connection to Supabase...'}
            {status === 'connected' && 'Connected to Supabase database'}
            {status === 'error' && 'Error connecting to Supabase'}
            {status === 'missing-env' && 'Missing Supabase configuration'}
          </p>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          status === 'loading' ? 'bg-yellow-500' :
          status === 'connected' ? 'bg-green-500' :
          'bg-red-500'
        }`}></div>
      </div>
      
      {status === 'error' && (
        <div className="mt-4">
          <p className="text-sm text-red-400 mb-2">Please check your Supabase configuration:</p>
          <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1">
            <li>Verify that you've created the tables (cargo_items, storage_containers, action_logs)</li>
            <li>Check that your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct in .env.local</li>
            <li>Make sure Row Level Security (RLS) policies are properly set up</li>
          </ol>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </Button>
        </div>
      )}

      {status === 'missing-env' && (
        <div className="mt-4">
          <p className="text-sm text-red-400 mb-2">Missing Supabase environment variables:</p>
          <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1">
            <li>Create a .env.local file in the root of your project</li>
            <li>Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the file</li>
            <li>Restart the development server</li>
          </ol>
          <p className="text-sm text-gray-400 mt-2">Example .env.local file:</p>
          <pre className="bg-gray-900 p-2 rounded text-xs mt-1 overflow-x-auto">
            VITE_SUPABASE_URL=your_supabase_url_here<br/>
            VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
          </pre>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  );
};

export default SupabaseStatus;
