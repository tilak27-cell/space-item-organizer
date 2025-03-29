
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CargoItem, StorageContainer, ActionLog, PlacementRecommendation, RearrangementPlan, Priority, Status } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SpaceCargoContextType {
  items: CargoItem[];
  containers: StorageContainer[];
  logs: ActionLog[];
  recommendations: PlacementRecommendation[];
  rearrangementPlan: RearrangementPlan | null;
  
  // Item actions
  addItem: (item: Omit<CargoItem, 'id' | 'lastModified' | 'usageCount'>) => void;
  updateItem: (id: string, updates: Partial<CargoItem>) => void;
  retrieveItem: (id: string) => void;
  markAsWaste: (id: string) => void;
  
  // Container actions
  addContainer: (container: Omit<StorageContainer, 'id' | 'usedCapacity' | 'items'>) => void;
  
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

// Sample data for initial state
const sampleItems: CargoItem[] = [
  {
    id: '1',
    name: 'Cargo Item 1',
    priority: 'medium',
    status: 'stored',
    location: 'Bay 1',
    weight: 6,
    volume: 16,
    lastModified: new Date(),
    usageCount: 0
  },
  {
    id: '2',
    name: 'Cargo Item 2',
    priority: 'medium',
    status: 'stored',
    location: 'Bay 2',
    weight: 61,
    volume: 8,
    lastModified: new Date(),
    usageCount: 0
  },
  {
    id: '3',
    name: 'Cargo Item 3',
    priority: 'high',
    status: 'waste',
    location: 'Bay 3',
    weight: 99,
    volume: 27,
    lastModified: new Date(),
    usageCount: 5
  },
  {
    id: '4',
    name: 'Cargo Item 4',
    priority: 'medium',
    status: 'in-transit',
    location: 'Bay 4',
    weight: 77,
    volume: 17,
    lastModified: new Date(),
    usageCount: 0
  },
  {
    id: '5',
    name: 'Cargo Item 5',
    priority: 'low',
    status: 'stored',
    location: 'Bay 9',
    weight: 25,
    volume: 12,
    lastModified: new Date(),
    usageCount: 0
  },
  {
    id: '6',
    name: 'Cargo Item 6',
    priority: 'low',
    status: 'stored',
    location: 'Bay 8',
    weight: 32,
    volume: 18,
    lastModified: new Date(),
    usageCount: 0
  }
];

const sampleContainers: StorageContainer[] = [
  {
    id: '1',
    name: 'Bay 1',
    capacity: 100,
    usedCapacity: 16,
    location: 'Module A',
    items: [sampleItems[0]]
  },
  {
    id: '2',
    name: 'Bay 2',
    capacity: 100,
    usedCapacity: 8,
    location: 'Module A',
    items: [sampleItems[1]]
  },
  {
    id: '3',
    name: 'Bay 3',
    capacity: 100,
    usedCapacity: 27,
    location: 'Module B',
    items: [sampleItems[2]]
  },
  {
    id: '4',
    name: 'Bay 4',
    capacity: 100,
    usedCapacity: 17,
    location: 'Module B',
    items: [sampleItems[3]]
  },
  {
    id: '5',
    name: 'Bay 5',
    capacity: 100,
    usedCapacity: 0,
    location: 'Module C',
    items: []
  },
  {
    id: '6',
    name: 'Bay 6',
    capacity: 100,
    usedCapacity: 0,
    location: 'Module C',
    items: []
  },
  {
    id: '7',
    name: 'Bay 7',
    capacity: 100,
    usedCapacity: 0,
    location: 'Module D',
    items: []
  },
  {
    id: '8',
    name: 'Bay 8',
    capacity: 100,
    usedCapacity: 18,
    location: 'Module D',
    items: [sampleItems[5]]
  },
  {
    id: '9',
    name: 'Bay 9',
    capacity: 100,
    usedCapacity: 12,
    location: 'Module E',
    items: [sampleItems[4]]
  },
  {
    id: '10',
    name: 'Bay 10',
    capacity: 100,
    usedCapacity: 0,
    location: 'Module E',
    items: []
  },
  {
    id: '11',
    name: 'Bay 11',
    capacity: 100,
    usedCapacity: 0,
    location: 'Module F',
    items: []
  },
  {
    id: '12',
    name: 'Bay 12',
    capacity: 100,
    usedCapacity: 0,
    location: 'Module F',
    items: []
  }
];

const sampleLogs: ActionLog[] = [
  {
    id: '1',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
    action: 'place',
    itemId: '1',
    itemName: 'Cargo Item 1',
    location: 'Bay 1',
    user: 'Astronaut Smith'
  },
  {
    id: '2',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
    action: 'retrieve',
    itemId: '3',
    itemName: 'Cargo Item 3',
    location: 'Bay 3',
    user: 'Astronaut Johnson'
  },
  {
    id: '3',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    action: 'dispose',
    itemId: '3',
    itemName: 'Cargo Item 3',
    user: 'Astronaut Wilson',
    details: 'Item marked as waste due to expiration'
  }
];

export const SpaceCargoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CargoItem[]>(sampleItems);
  const [containers, setContainers] = useState<StorageContainer[]>(sampleContainers);
  const [logs, setLogs] = useState<ActionLog[]>(sampleLogs);
  const [recommendations, setRecommendations] = useState<PlacementRecommendation[]>([]);
  const [rearrangementPlan, setRearrangementPlan] = useState<RearrangementPlan | null>(null);

  // Add a new cargo item
  const addItem = (item: Omit<CargoItem, 'id' | 'lastModified' | 'usageCount'>) => {
    const newItem: CargoItem = {
      ...item,
      id: `item-${Date.now()}`,
      lastModified: new Date(),
      usageCount: 0
    };
    
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
    addLog({
      action: 'place',
      itemId: newItem.id,
      itemName: newItem.name,
      location: newItem.location,
      user: 'Current User',
      details: `Added ${newItem.name} to ${newItem.location}`
    });
    
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to ${newItem.location}`,
    });
  };
  
  // Add a log entry
  const addLog = (log: Omit<ActionLog, 'id' | 'timestamp'>) => {
    const newLog: ActionLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date()
    };
    
    setLogs((prev) => [newLog, ...prev]);
  };
  
  // Update an existing item
  const updateItem = (id: string, updates: Partial<CargoItem>) => {
    setItems((prev) => 
      prev.map((item) => 
        item.id === id
          ? { ...item, ...updates, lastModified: new Date() }
          : item
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
                  items: [...container.items, { ...item, location: updates.location as string }]
                }
              : container
          )
        );
        
        // Add log
        addLog({
          action: 'relocate',
          itemId: id,
          itemName: item.name,
          location: updates.location,
          user: 'Current User',
          details: `Moved ${item.name} from ${item.location} to ${updates.location}`
        });
        
        toast({
          title: "Item Relocated",
          description: `${item.name} has been moved to ${updates.location}`,
        });
      }
    }
  };
  
  // Retrieve an item (increase usage count)
  const retrieveItem = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      updateItem(id, { usageCount: item.usageCount + 1 });
      
      // Add log
      addLog({
        action: 'retrieve',
        itemId: id,
        itemName: item.name,
        location: item.location,
        user: 'Current User',
        details: `Retrieved ${item.name} from ${item.location}`
      });
      
      toast({
        title: "Item Retrieved",
        description: `${item.name} has been retrieved from ${item.location}`,
      });
    }
  };
  
  // Mark item as waste
  const markAsWaste = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      updateItem(id, { status: 'waste' });
      
      // Add log
      addLog({
        action: 'dispose',
        itemId: id,
        itemName: item.name,
        user: 'Current User',
        details: `Marked ${item.name} as waste`
      });
      
      toast({
        title: "Item Marked as Waste",
        description: `${item.name} has been marked as waste`,
      });
    }
  };
  
  // Add a new container
  const addContainer = (container: Omit<StorageContainer, 'id' | 'usedCapacity' | 'items'>) => {
    const newContainer: StorageContainer = {
      ...container,
      id: `container-${Date.now()}`,
      usedCapacity: 0,
      items: []
    };
    
    setContainers((prev) => [...prev, newContainer]);
    
    toast({
      title: "Container Added",
      description: `${newContainer.name} has been added to the system`,
    });
  };
  
  // Import items from CSV
  const importItems = async (csv: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          
          const newItems: CargoItem[] = [];
          
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
            const newItem: CargoItem = {
              id: `item-${Date.now()}-${i}`,
              name: item.name || `Imported Item ${i}`,
              priority: item.priority || 'medium',
              status: item.status || 'stored',
              location: item.location || 'Unassigned',
              weight: item.weight || 0,
              volume: item.volume || 0,
              lastModified: new Date(),
              usageCount: 0,
              expirationDate: item.expirationDate
            };
            
            newItems.push(newItem);
          }
          
          // Add all the new items
          setItems((prev) => [...prev, ...newItems]);
          
          // Update containers
          newItems.forEach((item) => {
            setContainers((prev) => 
              prev.map((container) => 
                container.name === item.location
                  ? {
                      ...container,
                      usedCapacity: container.usedCapacity + item.volume,
                      items: [...container.items, item]
                    }
                  : container
              )
            );
          });
          
          toast({
            title: "Items Imported",
            description: `${newItems.length} items have been imported`,
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
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          
          const newContainers: StorageContainer[] = [];
          
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
            const newContainer: StorageContainer = {
              id: `container-${Date.now()}-${i}`,
              name: container.name || `Imported Container ${i}`,
              capacity: container.capacity || 100,
              usedCapacity: 0,
              location: container.location || 'Unassigned',
              items: []
            };
            
            newContainers.push(newContainer);
          }
          
          // Add all the new containers
          setContainers((prev) => [...prev, ...newContainers]);
          
          toast({
            title: "Containers Imported",
            description: `${newContainers.length} containers have been imported`,
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
          setTimeout(() => {
            addLog({
              action: 'dispose',
              itemId: item.id,
              itemName: item.name,
              user: 'System',
              details: `${item.name} has expired and has been marked as waste`
            });
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
