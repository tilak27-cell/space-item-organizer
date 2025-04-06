
import { CargoItem, StorageContainer, ActionLog, PlacementRecommendation, RearrangementPlan, Priority, Status } from '@/types';

export interface SpaceCargoContextType {
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
