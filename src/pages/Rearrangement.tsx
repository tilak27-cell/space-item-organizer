
import React from 'react';
import { RotateCcw, MoveRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useSpaceCargo } from '@/contexts/SpaceCargoContext';
import { useToast } from "@/hooks/use-toast";
import ItemCard from '@/components/ItemCard';

const Rearrangement = () => {
  const { 
    rearrangementPlan, 
    items, 
    containers, 
    getItemsByStatus,
    executeRearrangementPlan
  } = useSpaceCargo();
  
  const { toast } = useToast();
  
  const inTransitItems = getItemsByStatus('in-transit');
  
  // Calculate space stats
  const totalSpace = containers.reduce((sum, container) => sum + container.capacity, 0);
  const usedSpace = containers.reduce((sum, container) => sum + container.usedCapacity, 0);
  const availableSpace = totalSpace - usedSpace;
  const spacePercentage = (usedSpace / totalSpace) * 100;
  
  // Space needed for transit items
  const spaceNeeded = inTransitItems.reduce((sum, item) => sum + item.volume, 0);
  
  // Do we have enough space without rearrangement?
  const needsRearrangement = spaceNeeded > availableSpace;
  
  const handleExecuteRearrangement = () => {
    executeRearrangementPlan();
    toast({
      title: "Rearrangement Plan Executed",
      description: "Items have been successfully moved according to the plan",
    });
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rearrangement Planning</h1>
          <p className="text-gray-400">Optimize storage space by relocating low-priority items</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-space-dark-blue border-gray-800">
          <CardHeader>
            <CardTitle>{inTransitItems.length}</CardTitle>
            <CardDescription>Items Awaiting Placement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400">
              {spaceNeeded.toFixed(2)}m³ needed for new items
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-space-dark-blue border-gray-800">
          <CardHeader>
            <CardTitle>{availableSpace.toFixed(2)}m³</CardTitle>
            <CardDescription>Available Space</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={spacePercentage} className="h-2 bg-gray-800" />
            <div className="text-sm text-gray-400 mt-1">
              {spacePercentage.toFixed(0)}% of total space is used
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-space-dark-blue border-gray-800">
          <CardHeader>
            <CardTitle>{needsRearrangement ? 'Required' : 'Not Needed'}</CardTitle>
            <CardDescription>Rearrangement Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400">
              {needsRearrangement 
                ? 'Space optimization needed for new items' 
                : 'Sufficient space available for new items'
              }
            </div>
          </CardContent>
        </Card>
      </div>
      
      {needsRearrangement && (
        <Alert className="bg-yellow-500/20 border-yellow-500 mb-8">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <AlertTitle className="text-yellow-500">Insufficient Space Available</AlertTitle>
          <AlertDescription>
            Rearrangement is required to make space for incoming items
          </AlertDescription>
        </Alert>
      )}
      
      {rearrangementPlan && rearrangementPlan.steps.length > 0 ? (
        <div className="space-y-6">
          <div className="space-card p-6">
            <h2 className="text-xl font-bold mb-4">Recommended Rearrangement Plan</h2>
            <p className="text-gray-400 mb-6">{rearrangementPlan.reason}</p>
            
            <div className="space-y-4">
              {rearrangementPlan.steps.map((step, index) => (
                <div key={index} className="bg-space-darker-blue rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center mb-3">
                    <div className="bg-space-blue/20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <span className="text-space-blue font-medium">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-medium">Move {step.itemName}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div>From: {step.fromLocation}</div>
                    <MoveRight className="h-5 w-5 text-space-blue" />
                    <div>To: {step.toLocation}</div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    Priority: <span className={`priority-${step.priority}`}>{step.priority}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                className="bg-space-blue text-white hover:bg-blue-600"
                onClick={handleExecuteRearrangement}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Execute Rearrangement Plan
              </Button>
            </div>
          </div>
          
          <div className="space-card p-6">
            <h2 className="text-xl font-bold mb-4">Items Awaiting Placement</h2>
            <div className="space-y-4">
              {inTransitItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-card p-8 text-center">
          <RotateCcw className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Rearrangement Needed</h3>
          <p className="text-gray-400 mb-6">
            There is sufficient space for all items or no items need rearrangement at this time
          </p>
          
          {inTransitItems.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Items Awaiting Placement</h3>
              <div className="space-y-4">
                {inTransitItems.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rearrangement;
