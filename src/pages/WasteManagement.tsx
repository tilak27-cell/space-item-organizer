
import React, { useState } from 'react';
import { Trash, Box, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSpaceCargo } from '@/contexts/SpaceCargoContext';
import { useToast } from "@/hooks/use-toast";
import ItemCard from '@/components/ItemCard';

const WasteManagement = () => {
  const { 
    getWasteItems, 
    getActiveItems, 
    items, 
    exportCurrentArrangement, 
    prepareWasteForUndocking,
    expiringItems,
    wasteManifest
  } = useSpaceCargo();
  
  const { toast } = useToast();
  const [showManifestDialog, setShowManifestDialog] = useState(false);
  
  const wasteItems = getWasteItems();
  const activeItems = getActiveItems();
  
  // Use the identified expiring items
  const atRiskItems = expiringItems.slice(0, 3); // Show up to 3 expiring items
  
  const handlePrepareWaste = () => {
    prepareWasteForUndocking();
    toast({
      title: "Waste Prepared for Undocking",
      description: `${wasteItems.length} waste items have been moved to the Undocking Module`,
    });
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Waste Management</h1>
          <p className="text-gray-400">Track and dispose of waste items</p>
        </div>
        
        <Button className="bg-space-blue text-white hover:bg-blue-600" onClick={() => setShowManifestDialog(true)}>
          Generate Return Manifest
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-space-dark-blue border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-space-red mr-2">{wasteItems.length}</span>
              <span>Waste Items</span>
            </CardTitle>
            <CardDescription>Items marked for disposal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400">
              {wasteItems.reduce((total, item) => total + item.volume, 0).toFixed(2)}m³ of waste volume
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-space-dark-blue border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-space-green mr-2">{activeItems.length}</span>
              <span>Active Items</span>
            </CardTitle>
            <CardDescription>Items in storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400">
              {activeItems.reduce((total, item) => total + item.volume, 0).toFixed(2)}m³ of active storage
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <div className="space-card p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Waste Items</h2>
            
            {wasteItems.length === 0 ? (
              <div className="text-center text-gray-400 py-6">
                <Trash className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                <p>No waste items currently</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wasteItems.map(item => (
                  <ItemCard key={item.id} item={item} showActions={false} />
                ))}
              </div>
            )}
          </div>
          
          <Button 
            className="w-full bg-red-600 text-white hover:bg-red-700 mb-6"
            disabled={wasteItems.length === 0}
            onClick={handlePrepareWaste}
          >
            <Trash className="h-5 w-5 mr-2" />
            Move All Waste to Undocking Module
          </Button>
        </div>
        
        <div className="md:col-span-4">
          <div className="space-card p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Items at Risk</h2>
            <p className="text-gray-400 mb-4">Items nearing expiration or depletion</p>
            
            {atRiskItems.length === 0 ? (
              <div className="text-center text-gray-400 py-6">
                <p>No items at risk</p>
              </div>
            ) : (
              <div className="space-y-4">
                {atRiskItems.map(item => (
                  <div key={item.id} className="bg-space-darker-blue rounded-lg p-4 border border-yellow-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-400">Location: {item.location}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-yellow-500 p-1 h-auto">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="mt-2 text-sm">
                      <p className="text-yellow-500">
                        {item.expirationDate ? 
                          `Expires on ${item.expirationDate.toLocaleDateString()}` : 
                          'Low usage remaining'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-card p-6">
            <h2 className="text-xl font-bold mb-4">Disposal Instructions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Standard Waste</h3>
                <p className="text-sm text-gray-400">
                  Pack in standard waste containers and move to undocking module bay 3
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Hazardous Materials</h3>
                <p className="text-sm text-gray-400">
                  Use sealed containers with proper marking and move to undocking module bay 5
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Recyclable Materials</h3>
                <p className="text-sm text-gray-400">
                  Sort by material type and place in designated containers in processing area
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showManifestDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-space-dark-blue rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Cargo Return Manifest</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowManifestDialog(false)} 
                className="text-gray-400 hover:text-white"
              >
                &times;
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Manifest Summary</h3>
                <div className="bg-space-darker-blue rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Total Items:</p>
                      <p className="text-xl font-medium">
                        {wasteManifest ? wasteManifest.summary.totalItems : wasteItems.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Volume:</p>
                      <p className="text-xl font-medium">
                        {wasteManifest 
                          ? wasteManifest.summary.totalVolume.toFixed(2)
                          : wasteItems.reduce((total, item) => total + item.volume, 0).toFixed(2)}m³
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Weight:</p>
                      <p className="text-xl font-medium">
                        {wasteManifest 
                          ? wasteManifest.summary.totalWeight.toFixed(2)
                          : wasteItems.reduce((total, item) => total + item.weight, 0).toFixed(2)}kg
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Return Vehicle:</p>
                      <p className="text-xl font-medium">
                        {wasteManifest ? wasteManifest.summary.returnVehicle : 'Progress MS-23'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Items for Return</h3>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {wasteItems.map(item => (
                    <div key={item.id} className="bg-space-darker-blue rounded-lg p-3 flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">ID: {item.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{item.weight}kg</p>
                        <p className="text-sm">{item.volume}m³</p>
                      </div>
                    </div>
                  ))}
                  
                  {wasteItems.length === 0 && (
                    <div className="text-center text-gray-400 py-6">
                      <p>No items for return</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowManifestDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-space-blue text-white hover:bg-blue-600"
                  onClick={exportCurrentArrangement}
                >
                  Export Manifest
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteManagement;
