
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Package, Search, RefreshCw, Trash2, 
  Clock, FileText, Menu, X, Settings, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileMenuOpen, 
  toggleMobileMenu 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      navigate('/auth');
    }
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/cargo-placement', label: 'Cargo Placement', icon: Package },
    { path: '/item-search', label: 'Item Search', icon: Search },
    { path: '/rearrangement', label: 'Rearrangement', icon: RefreshCw },
    { path: '/waste-management', label: 'Waste Management', icon: Trash2 },
    { path: '/time-simulation', label: 'Time Simulation', icon: Clock },
    { path: '/logs', label: 'Logs', icon: FileText },
  ];
  
  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-50 lg:hidden" 
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>
      
      {/* Sidebar for both mobile and desktop */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full bg-space-dark-blue border-r border-gray-800 w-64 transition-transform duration-300 ease-in-out z-40 transform",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:w-24 lg:overflow-y-auto",
          "flex flex-col justify-between"
        )}
      >
        <div>
          <div className="py-6 flex items-center justify-center">
            <h1 className="text-xl font-bold text-center text-space-blue lg:text-sm">
              SPACE<br/>CARGO
            </h1>
          </div>
          
          <nav className="px-2">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center p-3 rounded-lg transition-colors",
                      "lg:flex-col lg:justify-center lg:py-4 lg:space-y-1",
                      isActive(item.path) 
                        ? "bg-space-blue text-white" 
                        : "text-gray-400 hover:bg-gray-800"
                    )}
                    onClick={() => {
                      if (isMobileMenuOpen) toggleMobileMenu();
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="ml-3 lg:ml-0 lg:text-xs">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        <div className="mt-auto pb-6 px-2">
          <button
            onClick={handleSignOut}
            className="flex items-center p-3 rounded-lg transition-colors text-gray-400 hover:bg-gray-800 w-full lg:flex-col lg:justify-center lg:py-4 lg:space-y-1"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3 lg:ml-0 lg:text-xs">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
