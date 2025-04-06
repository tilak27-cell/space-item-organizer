
import { CargoItem, Status, Priority } from '@/types';
import { toast } from '@/hooks/use-toast';
import { addItem as apiAddItem, updateItem as apiUpdateItem, addLog as apiAddLog } from '@/lib/api';

export const createItemOperations = (
  items: CargoItem[],
  setItems: React.Dispatch<React.SetStateAction<CargoItem[]>>,
  containers: any[],
  setContainers: React.Dispatch<React.SetStateAction<any[]>>,
  logs: any[],
  setLogs: React.Dispatch<React.SetStateAction<any[]>>,
  user: any
) => {
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
  
  // Filtering functions
  const getItemsByStatus = (status: Status) => {
    return items.filter((item) => item.status === status);
  };
  
  const getItemsByPriority = (priority: Priority) => {
    return items.filter((item) => item.priority === priority);
  };
  
  const getWasteItems = () => {
    return items.filter((item) => item.status === 'waste');
  };
  
  const getActiveItems = () => {
    return items.filter((item) => item.status !== 'waste');
  };

  return {
    addItem,
    updateItem,
    retrieveItem,
    markAsWaste,
    getItemsByStatus,
    getItemsByPriority,
    getWasteItems,
    getActiveItems
  };
};
