
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SpaceCargoProvider } from "./contexts/SpaceCargoContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CargoPlacement from "./pages/CargoPlacement";
import ItemSearch from "./pages/ItemSearch";
import Rearrangement from "./pages/Rearrangement";
import WasteManagement from "./pages/WasteManagement";
import TimeSimulation from "./pages/TimeSimulation";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-space-darker-blue">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SpaceCargoProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
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
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
