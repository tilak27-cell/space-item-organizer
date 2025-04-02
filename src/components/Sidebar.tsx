
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ChevronLeft, 
  Menu, X, 
  Home, 
  Package, 
  Search, 
  RotateCcw, 
  Trash, 
  Clock, 
  FileText,
  Rocket,
  Cube,
  BarChart3
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const navItems = [
  { 
    path: '/', 
    icon: <Home className="h-5 w-5" />, 
    label: 'Dashboard',
    badge: ''
  },
  { 
    path: '/cargo-placement', 
    icon: <Package className="h-5 w-5" />, 
    label: 'Cargo Placement',
    badge: ''
  },
  { 
    path: '/item-search', 
    icon: <Search className="h-5 w-5" />, 
    label: 'Item Search',
    badge: ''
  },
  { 
    path: '/rearrangement', 
    icon: <RotateCcw className="h-5 w-5" />, 
    label: 'Rearrangement',
    badge: ''
  },
  { 
    path: '/waste-management', 
    icon: <Trash className="h-5 w-5" />, 
    label: 'Waste Management',
    badge: ''
  },
  { 
    path: '/time-simulation', 
    icon: <Clock className="h-5 w-5" />, 
    label: 'Time Simulation',
    badge: ''
  },
  { 
    path: '/mission-control', 
    icon: <Rocket className="h-5 w-5" />, 
    label: 'Mission Control',
    badge: 'NEW'
  },
  { 
    path: '/cargo-visualizer', 
    icon: <Cube className="h-5 w-5" />, 
    label: '3D Visualizer',
    badge: 'NEW'
  },
  { 
    path: '/analytics', 
    icon: <BarChart3 className="h-5 w-5" />, 
    label: 'Analytics',
    badge: 'NEW'
  },
  { 
    path: '/logs', 
    icon: <FileText className="h-5 w-5" />, 
    label: 'Logs',
    badge: ''
  }
];

const Sidebar = ({ isMobileMenuOpen, toggleMobileMenu }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const toggleSidebar = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  // Close menu when route changes on mobile
  React.useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      toggleMobileMenu();
    }
  }, [location.pathname, isMobile, isMobileMenuOpen, toggleMobileMenu]);
  
  // Animation variants
  const sidebarVariants = {
    expanded: { width: '240px', transition: { duration: 0.3 } },
    collapsed: { width: '72px', transition: { duration: 0.3 } }
  };
  
  const labelVariants = {
    expanded: { opacity: 1, x: 0, display: 'block', transition: { duration: 0.2, delay: 0.1 } },
    collapsed: { opacity: 0, x: -10, transition: { duration: 0.2 }, transitionEnd: { display: 'none' } }
  };
  
  const mobileMenuVariants = {
    open: { x: 0, transition: { duration: 0.3 } },
    closed: { x: '-100%', transition: { duration: 0.3 } }
  };
  
  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-gray-800 text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
              onClick={toggleMobileMenu}
            />
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="fixed top-0 left-0 z-40 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-gray-800 overflow-y-auto"
            >
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Rocket className="h-6 w-6 text-blue-400" />
                  <span className="font-bold text-lg text-white">Space Cargo</span>
                </div>
                <button onClick={toggleMobileMenu} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-3 py-4 space-y-1">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                      cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-md transition-all",
                        isActive 
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-gray-400 hover:text-white hover:bg-gray-800"
                      )
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          variants={sidebarVariants}
          initial={false}
          animate={isCollapsed ? "collapsed" : "expanded"}
          className="fixed top-0 left-0 z-30 h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-gray-800 overflow-hidden"
        >
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 overflow-hidden">
              <Rocket className="h-6 w-6 text-blue-400 flex-shrink-0" />
              <motion.span 
                variants={labelVariants}
                initial={false}
                animate={isCollapsed ? "collapsed" : "expanded"}
                className="font-bold text-lg text-white whitespace-nowrap"
              >
                Space Cargo
              </motion.span>
            </div>
            <button 
              onClick={toggleSidebar} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className={`h-5 w-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <div className="px-3 py-4 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  cn(
                    "flex items-center px-4 py-3 rounded-md transition-all relative overflow-hidden group",
                    isActive 
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )
                }
              >
                <div className="flex-shrink-0 relative z-10">{item.icon}</div>
                <motion.span 
                  variants={labelVariants}
                  initial={false}
                  animate={isCollapsed ? "collapsed" : "expanded"}
                  className="ml-3 whitespace-nowrap relative z-10"
                >
                  {item.label}
                </motion.span>
                {item.badge && (
                  <motion.span 
                    variants={labelVariants}
                    initial={false}
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full relative z-10"
                  >
                    {item.badge}
                  </motion.span>
                )}
                {/* Hover effect */}
                <motion.div 
                  className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ originX: 0 }}
                  initial={false}
                  animate={isCollapsed ? { scaleX: 0 } : { scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </NavLink>
            ))}
          </div>
          
          {/* Version info */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <motion.div 
              variants={labelVariants}
              initial={false}
              animate={isCollapsed ? "collapsed" : "expanded"}
              className="text-xs text-gray-500 text-center"
            >
              Version 2.0.3
            </motion.div>
          </div>
        </motion.aside>
      )}
    </>
  );
};

export default Sidebar;
