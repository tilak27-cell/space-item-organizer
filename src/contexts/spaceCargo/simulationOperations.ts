
import { CargoItem } from '@/types';
import { toast } from '@/hooks/use-toast';
import { addLog as apiAddLog, updateItem as apiUpdateItem } from '@/lib/api';

export const createSimulationOperations = (
  items: CargoItem[],
  setItems: React.Dispatch<React.SetStateAction<CargoItem[]>>,
  logs: any[],
  setLogs: React.Dispatch<React.SetStateAction<any[]>>
) => {
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

  return {
    simulateDay,
    simulateDays
  };
};
