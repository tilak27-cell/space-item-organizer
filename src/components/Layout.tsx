
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      
      <main className="flex-1 p-4 lg:pl-28">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
