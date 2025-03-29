
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Search, 
  RotateCcw, 
  Trash, 
  Clock, 
  FileText,
  Menu 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/cargo-placement', icon: Package, label: 'Cargo Placement' },
    { path: '/item-search', icon: Search, label: 'Item Search' },
    { path: '/rearrangement', icon: RotateCcw, label: 'Rearrangement' },
    { path: '/waste-management', icon: Trash, label: 'Waste Management' },
    { path: '/time-simulation', icon: Clock, label: 'Time Simulation' },
    { path: '/logs', icon: FileText, label: 'Logs' },
  ];
  
  return (
    <>
      {/* Mobile menu toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-space-blue p-2 rounded-md" 
        onClick={toggleMobileMenu}
      >
        <Menu className="text-white" />
      </button>
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 bg-space-dark-blue w-20 flex flex-col items-center py-8 border-r border-gray-800 transition-transform duration-300 ease-in-out z-40",
        !isMobileMenuOpen && "lg:translate-x-0 -translate-x-full",
        isMobileMenuOpen && "translate-x-0"
      )}>
        {/* Logo */}
        <div className="mb-12">
          <Package className="h-10 w-10 text-space-blue" />
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col items-center space-y-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "p-3 rounded-lg transition-all flex flex-col items-center",
                isActive(item.path) 
                  ? "bg-space-blue text-white" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <item.icon className="h-6 w-6" />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
