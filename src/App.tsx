
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpaceCargoProvider } from "./contexts/SpaceCargoContext";
import { useEffect, useState } from "react";

import SpaceLoading from "./components/SpaceLoading";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CargoPlacement from "./pages/CargoPlacement";
import ItemSearch from "./pages/ItemSearch";
import Rearrangement from "./pages/Rearrangement";
import WasteManagement from "./pages/WasteManagement";
import TimeSimulation from "./pages/TimeSimulation";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SpaceCargoProvider>
          <Toaster />
          <Sonner />
          {isLoading && <SpaceLoading />}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="cargo-placement" element={<CargoPlacement />} />
                <Route path="item-search" element={<ItemSearch />} />
                <Route path="rearrangement" element={<Rearrangement />} />
                <Route path="waste-management" element={<WasteManagement />} />
                <Route path="time-simulation" element={<TimeSimulation />} />
                <Route path="logs" element={<Logs />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SpaceCargoProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
