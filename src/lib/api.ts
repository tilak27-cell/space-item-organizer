
import { supabase } from './supabase';
import { CargoItem, StorageContainer, ActionLog, PlacementRecommendation, RearrangementPlan } from '@/types';
import { toast } from '@/hooks/use-toast';

// Convert database row to frontend type
const mapItemFromDB = (item: any): CargoItem => ({
  id: item.id,
  name: item.name,
  priority: item.priority,
  status: item.status,
  location: item.location,
  weight: item.weight,
  volume: item.volume,
  lastModified: new Date(item.last_modified),
  expirationDate: item.expiration_date ? new Date(item.expiration_date) : undefined,
  usageCount: item.usage_count
});

const mapContainerFromDB = (container: any, items: CargoItem[] = []): StorageContainer => ({
  id: container.id,
  name: container.name,
  capacity: container.capacity,
  usedCapacity: container.used_capacity,
  location: container.location,
  items: items.filter(item => item.location === container.name)
});

const mapLogFromDB = (log: any): ActionLog => ({
  id: log.id,
  timestamp: new Date(log.timestamp),
  action: log.action,
  itemId: log.item_id,
  itemName: log.item_name,
  location: log.location,
  user: log.user,
  details: log.details
});

// Cargo Items API
export async function fetchItems(): Promise<CargoItem[]> {
  const { data, error } = await supabase
    .from('cargo_items')
    .select('*');
  
  if (error) {
    console.error('Error fetching items:', error);
    toast({
      title: "Error",
      description: "Failed to fetch cargo items",
      variant: "destructive"
    });
    return [];
  }
  
  return data.map(mapItemFromDB);
}

export async function addItem(item: Omit<CargoItem, 'id' | 'lastModified' | 'usageCount'>): Promise<CargoItem | null> {
  const { data, error } = await supabase
    .from('cargo_items')
    .insert({
      name: item.name,
      priority: item.priority,
      status: item.status,
      location: item.location,
      weight: item.weight,
      volume: item.volume,
      last_modified: new Date().toISOString(),
      expiration_date: item.expirationDate?.toISOString(),
      usage_count: 0
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding item:', error);
    toast({
      title: "Error",
      description: "Failed to add cargo item",
      variant: "destructive"
    });
    return null;
  }
  
  return mapItemFromDB(data);
}

export async function updateItem(id: string, updates: Partial<CargoItem>): Promise<CargoItem | null> {
  const dbUpdates: any = {
    ...updates,
    last_modified: new Date().toISOString()
  };
  
  // Map frontend property names to database column names
  if (updates.lastModified) {
    dbUpdates.last_modified = updates.lastModified.toISOString();
    delete dbUpdates.lastModified;
  }
  
  if (updates.expirationDate) {
    dbUpdates.expiration_date = updates.expirationDate.toISOString();
    delete dbUpdates.expirationDate;
  }
  
  if (updates.usageCount !== undefined) {
    dbUpdates.usage_count = updates.usageCount;
    delete dbUpdates.usageCount;
  }
  
  const { data, error } = await supabase
    .from('cargo_items')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating item:', error);
    toast({
      title: "Error",
      description: "Failed to update cargo item",
      variant: "destructive"
    });
    return null;
  }
  
  return mapItemFromDB(data);
}

// Storage Containers API
export async function fetchContainers(): Promise<StorageContainer[]> {
  const { data: containers, error: containersError } = await supabase
    .from('storage_containers')
    .select('*');
  
  if (containersError) {
    console.error('Error fetching containers:', containersError);
    toast({
      title: "Error",
      description: "Failed to fetch storage containers",
      variant: "destructive"
    });
    return [];
  }
  
  const items = await fetchItems();
  
  return containers.map(container => mapContainerFromDB(container, items));
}

export async function addContainer(container: Omit<StorageContainer, 'id' | 'usedCapacity' | 'items'>): Promise<StorageContainer | null> {
  const { data, error } = await supabase
    .from('storage_containers')
    .insert({
      name: container.name,
      capacity: container.capacity,
      used_capacity: 0,
      location: container.location
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding container:', error);
    toast({
      title: "Error",
      description: "Failed to add storage container",
      variant: "destructive"
    });
    return null;
  }
  
  return mapContainerFromDB(data);
}

// Action Logs API
export async function fetchLogs(): Promise<ActionLog[]> {
  const { data, error } = await supabase
    .from('action_logs')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (error) {
    console.error('Error fetching logs:', error);
    toast({
      title: "Error",
      description: "Failed to fetch action logs",
      variant: "destructive"
    });
    return [];
  }
  
  return data.map(mapLogFromDB);
}

export async function addLog(log: Omit<ActionLog, 'id' | 'timestamp'>): Promise<ActionLog | null> {
  const { data, error } = await supabase
    .from('action_logs')
    .insert({
      timestamp: new Date().toISOString(),
      action: log.action,
      item_id: log.itemId,
      item_name: log.itemName,
      location: log.location,
      user: log.user,
      details: log.details
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding log:', error);
    toast({
      title: "Error",
      description: "Failed to add action log",
      variant: "destructive"
    });
    return null;
  }
  
  return mapLogFromDB(data);
}
