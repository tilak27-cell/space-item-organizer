
import { StorageContainer } from '@/types';
import { toast } from '@/hooks/use-toast';
import { addContainer as apiAddContainer } from '@/lib/api';

export const createContainerOperations = (
  containers: StorageContainer[],
  setContainers: React.Dispatch<React.SetStateAction<StorageContainer[]>>
) => {
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

  return {
    addContainer
  };
};
