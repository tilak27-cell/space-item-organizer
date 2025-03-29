
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dark-mode', 'false');
    }
  };
  
  // Check for saved dark mode preference on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Close mobile menu when switching to desktop view
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);
  
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      
      <main className="flex-1 p-4 lg:pl-28 overflow-x-hidden">
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Switch 
              checked={darkMode} 
              onCheckedChange={toggleDarkMode} 
              aria-label="Toggle dark mode"
            />
            <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        
        <div className="mobile-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
