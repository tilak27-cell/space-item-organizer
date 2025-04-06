
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchItems, fetchContainers, fetchLogs } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { SpaceCargoContextType } from './types';
import { createItemOperations } from './itemOperations';
import { createContainerOperations } from './containerOperations';
import { createCsvOperations } from './csvOperations';
import { createSimulationOperations } from './simulationOperations';
import { useRecommendations } from './recommendationOperations';
import { CargoItem, StorageContainer, ActionLog } from '@/types';

const SpaceCargoContext = createContext<SpaceCargoContextType | undefined>(undefined);

export const SpaceCargoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CargoItem[]>([]);
  const [containers, setContainers] = useState<StorageContainer[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const [fetchedItems, fetchedContainers, fetchedLogs] = await Promise.all([
          fetchItems(),
          fetchContainers(),
          fetchLogs()
        ]);
        
        setItems(fetchedItems);
        setContainers(fetchedContainers);
        setLogs(fetchedLogs);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load data from the database",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  // Create operations
  const itemOps = createItemOperations(items, setItems, containers, setContainers, logs, setLogs, user);
  const containerOps = createContainerOperations(containers, setContainers);

  // Create CSV operations (which depend on item and container operations)
  const csvOps = createCsvOperations(items, itemOps.addItem, containerOps.addContainer);
  
  // Create simulation operations
  const simOps = createSimulationOperations(items, setItems, logs, setLogs);
  
  // Get recommendations and rearrangement plans
  const { recommendations, rearrangementPlan } = useRecommendations(items, containers);

  return (
    <SpaceCargoContext.Provider
      value={{
        items,
        containers,
        logs,
        recommendations,
        rearrangementPlan,
        isLoading,
        ...itemOps,
        ...containerOps,
        ...csvOps,
        ...simOps
      }}
    >
      {children}
    </SpaceCargoContext.Provider>
  );
};

export const useSpaceCargo = (): SpaceCargoContextType => {
  const context = useContext(SpaceCargoContext);
  if (context === undefined) {
    throw new Error('useSpaceCargo must be used within a SpaceCargoProvider');
  }
  return context;
};
