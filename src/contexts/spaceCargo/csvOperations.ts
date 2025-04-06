
import { CargoItem, Priority, Status } from '@/types';
import { toast } from '@/hooks/use-toast';

export const createCsvOperations = (
  items: CargoItem[],
  addItem: (item: Omit<CargoItem, 'id' | 'lastModified' | 'usageCount'>) => Promise<void>,
  addContainer: (container: any) => Promise<void>
) => {
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

  return {
    importItems,
    importContainers,
    exportCurrentArrangement
  };
};
