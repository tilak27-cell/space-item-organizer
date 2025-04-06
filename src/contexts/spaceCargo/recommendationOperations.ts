
import { useState, useEffect } from 'react';
import { CargoItem, StorageContainer, PlacementRecommendation, RearrangementPlan } from '@/types';

export const useRecommendations = (
  items: CargoItem[],
  containers: StorageContainer[]
) => {
  const [recommendations, setRecommendations] = useState<PlacementRecommendation[]>([]);
  const [rearrangementPlan, setRearrangementPlan] = useState<RearrangementPlan | null>(null);

  // Generate placement recommendations and rearrangement plans
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

  return { recommendations, rearrangementPlan };
};
