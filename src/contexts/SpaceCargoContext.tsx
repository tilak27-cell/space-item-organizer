
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CargoItem, StorageContainer, ActionLog, PlacementRecommendation, RearrangementPlan, Priority, Status } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { fetchItems, fetchContainers, fetchLogs, addItem as apiAddItem, updateItem as apiUpdateItem, addContainer as apiAddContainer, addLog as apiAddLog } from '@/lib/api';

interface SpaceCargoContextType {
  items: CargoItem[];
  containers: StorageContainer[];
  logs: ActionLog[];
  recommendations: PlacementRecommendation[];
  rearrangementPlan: RearrangementPlan | null;
  isLoading: boolean;
  
  // Item actions
  addItem: (item: Omit<CargoItem, 'id' | 'lastModified' | 'usageCount'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<CargoItem>) => Promise<void>;
  retrieveItem: (id: string) => Promise<void>;
  markAsWaste: (id: string) => Promise<void>;
  
  // Container actions
  addContainer: (container: Omit<StorageContainer, 'id' | 'usedCapacity' | 'items'>) => Promise<void>;
  
  // CSV import/export
  importItems: (csv: File) => Promise<void>;
  importContainers: (csv: File) => Promise<void>;
  exportCurrentArrangement: () => void;
  
  // Time simulation
  simulateDay: () => void;
  simulateDays: (days: number) => void;
  
  // Filtering
  getItemsByStatus: (status: Status) => CargoItem[];
  getItemsByPriority: (priority: Priority) => CargoItem[];
  getWasteItems: () => CargoItem[];
  getActiveItems: () => CargoItem[];
}

const SpaceCargoContext = createContext<SpaceCargoContextType | undefined>(undefined);

export const SpaceCargoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CargoItem[]>([]);
  const [containers, setContainers] = useState<StorageContainer[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [recommendations, setRecommendations] = useState<PlacementRecommendation[]>([]);
  const [rearrangementPlan, setRearrangementPlan] = useState<RearrangementPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from Supabase
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

  // Add a new cargo item
  const addItem = async (item: Omit<CargoItem, 'id' | 'lastModified' | 'usageCount'>) => {
    try {
      const newItem = await apiAddItem(item);
      
      if (newItem) {
        setItems((prev) => [...prev, newItem]);
        
        // Update container
        setContainers((prev) => 
          prev.map((container) => 
            container.name === newItem.location
              ? {
                  ...container,
                  usedCapacity: container.usedCapacity + newItem.volume,
                  items: [...container.items, newItem]
                }
              : container
          )
        );
        
        // Add log
        const logEntry = await apiAddLog({
          action: 'place',
          itemId: newItem.id,
          itemName: newItem.name,
          location: newItem.location,
          user: user?.email || 'Current User',
          details: `Added ${newItem.name} to ${newItem.location}`
        });
        
        if (logEntry) {
          setLogs((prev) => [logEntry, ...prev]);
        }
        
        toast({
          title: "Item Added",
          description: `${newItem.name} has been added to ${newItem.location}`,
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive"
      });
    }
  };
  
  // Update an existing item
  const updateItem = async (id: string, updates: Partial<CargoItem>) => {
    try {
      const updatedItem = await apiUpdateItem(id, updates);
      
      if (updatedItem) {
        setItems((prev) => 
          prev.map((item) => 
            item.id === id ? updatedItem : item
          )
        );
        
        // If location changed, update containers
        if (updates.location) {
          const item = items.find((item) => item.id === id);
          if (item) {
            // Remove from old container
            setContainers((prev) => 
              prev.map((container) => 
                container.name === item.location
                  ? {
                      ...container,
                      usedCapacity: container.usedCapacity - item.volume,
                      items: container.items.filter((i) => i.id !== id)
                    }
                  : container
              )
            );
            
            // Add to new container
            setContainers((prev) => 
              prev.map((container) => 
                container.name === updates.location
                  ? {
                      ...container,
                      usedCapacity: container.usedCapacity + item.volume,
                      items: [...container.items, updatedItem]
                    }
                  : container
              )
            );
            
            // Add log
            const logEntry = await apiAddLog({
              action: 'relocate',
              itemId: id,
              itemName: item.name,
              location: updates.location,
              user: user?.email || 'Current User',
              details: `Moved ${item.name} from ${item.location} to ${updates.location}`
            });
            
            if (logEntry) {
              setLogs((prev) => [logEntry, ...prev]);
            }
            
            toast({
              title: "Item Relocated",
              description: `${item.name} has been moved to ${updates.location}`,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive"
      });
    }
  };
  
  // Retrieve an item (increase usage count)
  const retrieveItem = async (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      await updateItem(id, { usageCount: item.usageCount + 1 });
      
      // Add log
      const logEntry = await apiAddLog({
        action: 'retrieve',
        itemId: id,
        itemName: item.name,
        location: item.location,
        user: user?.email || 'Current User',
        details: `Retrieved ${item.name} from ${item.location}`
      });
      
      if (logEntry) {
        setLogs((prev) => [logEntry, ...prev]);
      }
      
      toast({
        title: "Item Retrieved",
        description: `${item.name} has been retrieved from ${item.location}`,
      });
    }
  };
  
  // Mark item as waste
  const markAsWaste = async (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      await updateItem(id, { status: 'waste' });
      
      // Add log
      const logEntry = await apiAddLog({
        action: 'dispose',
        itemId: id,
        itemName: item.name,
        user: user?.email || 'Current User',
        details: `Marked ${item.name} as waste`
      });
      
      if (logEntry) {
        setLogs((prev) => [logEntry, ...prev]);
      }
      
      toast({
        title: "Item Marked as Waste",
        description: `${item.name} has been marked as waste`,
      });
    }
  };
  
  // Add a new container
  const addContainer = async (container: Omit<StorageContainer, 'id' | 'usedCapacity' | 'items'>) => {
    try {
      const newContainer = await apiAddContainer(container);
      
      if (newContainer) {
        setContainers((prev) => [...prev, newContainer]);
        
        toast({
          title: "Container Added",
          description: `${newContainer.name} has been added to the system`,
        });
      }
    } catch (error) {
      console.error('Error adding container:', error);
      toast({
        title: "Error",
        description: "Failed to add container",
        variant: "destructive"
      });
    }
  };
  
  // Import items from CSV
  const importItems = async (csv: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          
          const importPromises = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',');
            const item: any = {};
            
            headers.forEach((header, index) => {
              const value = values[index]?.trim();
              if (header === 'priority') {
                item[header] = value.toLowerCase() as Priority;
              } else if (header === 'status') {
                item[header] = value.toLowerCase() as Status;
              } else if (header === 'weight' || header === 'volume') {
                item[header] = parseFloat(value);
              } else if (header === 'expirationDate') {
                item[header] = value ? new Date(value) : undefined;
              } else {
                item[header] = value;
              }
            });
            
            // Add missing required fields
            const newItem = {
              name: item.name || `Imported Item ${i}`,
              priority: item.priority || 'medium',
              status: item.status || 'stored',
              location: item.location || 'Unassigned',
              weight: item.weight || 0,
              volume: item.volume || 0,
              expirationDate: item.expirationDate
            };
            
            importPromises.push(addItem(newItem));
          }
          
          await Promise.all(importPromises);
          
          toast({
            title: "Items Imported",
            description: `${importPromises.length} items have been imported`,
          });
          
          resolve();
        } catch (error) {
          console.error("Error importing items:", error);
          toast({
            title: "Import Error",
            description: "There was an error importing the items. Please check the CSV format.",
            variant: "destructive"
          });
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
          title: "File Error",
          description: "There was an error reading the file",
          variant: "destructive"
        });
        reject(error);
      };
      
      reader.readAsText(csv);
    });
  };
  
  // Import containers from CSV
  const importContainers = async (csv: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          
          const importPromises = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',');
            const container: any = {};
            
            headers.forEach((header, index) => {
              const value = values[index]?.trim();
              if (header === 'capacity') {
                container[header] = parseFloat(value);
              } else {
                container[header] = value;
              }
            });
            
            // Add missing required fields
            const newContainer = {
              name: container.name || `Imported Container ${i}`,
              capacity: container.capacity || 100,
              location: container.location || 'Unassigned'
            };
            
            importPromises.push(addContainer(newContainer));
          }
          
          await Promise.all(importPromises);
          
          toast({
            title: "Containers Imported",
            description: `${importPromises.length} containers have been imported`,
          });
          
          resolve();
        } catch (error) {
          console.error("Error importing containers:", error);
          toast({
            title: "Import Error",
            description: "There was an error importing the containers. Please check the CSV format.",
            variant: "destructive"
          });
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
          title: "File Error",
          description: "There was an error reading the file",
          variant: "destructive"
        });
        reject(error);
      };
      
      reader.readAsText(csv);
    });
  };
  
  // Export current arrangement to CSV
  const exportCurrentArrangement = () => {
    try {
      // Create CSV content
      let csv = 'id,name,priority,status,location,weight,volume,lastModified,usageCount,expirationDate\n';
      
      items.forEach((item) => {
        csv += `${item.id},${item.name},${item.priority},${item.status},${item.location},${item.weight},${item.volume},${item.lastModified.toISOString()},${item.usageCount},${item.expirationDate ? item.expirationDate.toISOString() : ''}\n`;
      });
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `space-cargo-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "The current arrangement has been exported to a CSV file",
      });
    } catch (error) {
      console.error("Error exporting arrangement:", error);
      toast({
        title: "Export Error",
        description: "There was an error exporting the arrangement",
        variant: "destructive"
      });
    }
  };
  
  // Simulate one day
  const simulateDay = () => {
    // Check for expired items
    const today = new Date();
    
    setItems((prev) => 
      prev.map((item) => {
        if (item.expirationDate && item.expirationDate <= today && item.status !== 'waste') {
          // Add log for expired item
          setTimeout(async () => {
            const logEntry = await apiAddLog({
              action: 'dispose',
              itemId: item.id,
              itemName: item.name,
              user: 'System',
              details: `${item.name} has expired and has been marked as waste`
            });
            
            if (logEntry) {
              setLogs((prev) => [logEntry, ...prev]);
            }
            
            // Also update in database
            await apiUpdateItem(item.id, { status: 'waste', lastModified: today });
          }, 0);
          
          return { ...item, status: 'waste', lastModified: today };
        }
        return item;
      })
    );
    
    toast({
      title: "Day Simulated",
      description: "One day has been simulated, checking for expirations",
    });
  };
  
  // Simulate multiple days
  const simulateDays = (days: number) => {
    for (let i = 0; i < days; i++) {
      simulateDay();
    }
    
    toast({
      title: "Multiple Days Simulated",
      description: `${days} days have been simulated`,
    });
  };
  
  // Get items by status
  const getItemsByStatus = (status: Status) => {
    return items.filter((item) => item.status === status);
  };
  
  // Get items by priority
  const getItemsByPriority = (priority: Priority) => {
    return items.filter((item) => item.priority === priority);
  };
  
  // Get all waste items
  const getWasteItems = () => {
    return items.filter((item) => item.status === 'waste');
  };
  
  // Get all active (non-waste) items
  const getActiveItems = () => {
    return items.filter((item) => item.status !== 'waste');
  };

  // Generate placement recommendations when items or containers change
  useEffect(() => {
    // Simple algorithm for recommendations based on available space and priority
    const availableContainers = containers.filter((container) => 
      container.usedCapacity < container.capacity
    );
    
    const newRecommendations: PlacementRecommendation[] = items
      .filter((item) => item.status === 'in-transit')
      .map((item) => {
        // Find best container for this item based on priority and available space
        const bestContainer = availableContainers
          .filter((container) => container.capacity - container.usedCapacity >= item.volume)
          .sort((a, b) => {
            if (item.priority === 'high') {
              // For high priority, prefer containers with less items
              return a.items.length - b.items.length;
            } else {
              // For medium/low priority, prefer containers with more available space
              return (b.capacity - b.usedCapacity) - (a.capacity - a.usedCapacity);
            }
          })[0];
        
        if (bestContainer) {
          return {
            itemId: item.id,
            itemName: item.name,
            recommendedContainer: bestContainer.name,
            reason: item.priority === 'high'
              ? 'High priority item placed in most accessible location'
              : 'Placed based on available space and priority'
          };
        }
        
        // If no suitable container found, suggest rearrangement
        return {
          itemId: item.id,
          itemName: item.name,
          recommendedContainer: 'Requires rearrangement',
          reason: 'No suitable container available with current arrangement'
        };
      });
    
    setRecommendations(newRecommendations);
    
    // Generate rearrangement plan if needed
    const itemsNeedingRearrangement = newRecommendations.filter(
      (rec) => rec.recommendedContainer === 'Requires rearrangement'
    );
    
    if (itemsNeedingRearrangement.length > 0) {
      // Find low priority items that could be moved
      const movableItems = items.filter((item) => 
        item.priority === 'low' && item.status === 'stored'
      );
      
      if (movableItems.length > 0) {
        const plan: RearrangementPlan = {
          steps: movableItems.slice(0, itemsNeedingRearrangement.length).map((item, index) => {
            const transitItem = items.find((i) => i.id === itemsNeedingRearrangement[index].itemId);
            return {
              itemId: item.id,
              itemName: item.name,
              fromLocation: item.location,
              toLocation: 'Temporary Storage',
              priority: item.priority
            };
          }),
          reason: 'Low priority items need to be relocated to make space for incoming items'
        };
        
        setRearrangementPlan(plan);
      } else {
        setRearrangementPlan(null);
      }
    } else {
      setRearrangementPlan(null);
    }
  }, [items, containers]);

  return (
    <SpaceCargoContext.Provider
      value={{
        items,
        containers,
        logs,
        recommendations,
        rearrangementPlan,
        isLoading,
        addItem,
        updateItem,
        retrieveItem,
        markAsWaste,
        addContainer,
        importItems,
        importContainers,
        exportCurrentArrangement,
        simulateDay,
        simulateDays,
        getItemsByStatus,
        getItemsByPriority,
        getWasteItems,
        getActiveItems
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
