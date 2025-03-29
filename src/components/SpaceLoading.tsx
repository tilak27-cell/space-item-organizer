
import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface SpaceLoadingProps {
  timeout?: number;
}

const SpaceLoading: React.FC<SpaceLoadingProps> = ({ timeout = 2000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [timeout]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-space-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-8 h-8 text-space-blue animate-pulse" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-display text-space-blue">Loading Space Items</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Preparing your cosmic inventory...</p>
        </div>
        
        {/* Stars animation background */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${(Math.random() * 3) + 1}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpaceLoading;
