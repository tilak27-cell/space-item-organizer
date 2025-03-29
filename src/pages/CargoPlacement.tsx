
import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import StorageContainer from '@/components/StorageContainer';
import CSVUploader from '@/components/CSVUploader';
import ItemCard from '@/components/ItemCard';

import { useSpaceCargo } from '@/contexts/SpaceCargoContext';
import { CargoItem } from '@/types';

const CargoPlacement = () => {
  const { 
    containers, 
    items,
    recommendations,
    importItems,
    importContainers,
    exportCurrentArrangement,
    addItem
  } = useSpaceCargo();
  
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  
  // New item form state
  const [newItem, setNewItem] = useState<Partial<CargoItem>>({
    name: '',
    priority: 'medium',
    status: 'stored',
    location: '',
    weight: 0,
    volume: 0
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'weight' || name === 'volume' ? parseFloat(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddItem = () => {
    if (!newItem.name || !newItem.location) return;
    
    addItem({
      name: newItem.name || '',
      priority: (newItem.priority as 'low' | 'medium' | 'high') || 'medium',
      status: (newItem.status as 'stored' | 'in-transit' | 'waste') || 'stored',
      location: newItem.location || '',
      weight: newItem.weight || 0,
      volume: newItem.volume || 0,
      expirationDate: undefined
    });
    
    // Reset form
    setNewItem({
      name: '',
      priority: 'medium',
      status: 'stored',
      location: '',
      weight: 0,
      volume: 0
    });
    
    setNewItemDialogOpen(false);
  };
  
  // Filter containers for selected one
  const selectedContainerData = selectedContainer 
    ? containers.find(c => c.name === selectedContainer) 
    : null;
  
  // Get items for selected container
  const containerItems = selectedContainerData
    ? items.filter(item => item.location === selectedContainerData.name)
    : [];
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cargo Placement</h1>
          <p className="text-gray-400">Manage and organize cargo items in storage containers</p>
        </div>
        
        <div className="flex space-x-3 items-center">
          <div className="flex items-center space-x-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>Low Priority</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-space-blue" />
            <span className="text-sm">System Status: Optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-space-green" />
            <span className="text-sm">All Systems Nominal</span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="containers">
        <TabsList className="bg-space-dark-blue">
          <TabsTrigger value="containers">Storage Containers</TabsTrigger>
          <TabsTrigger value="recommendations">Placement Recommendations</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="containers">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Container grid */}
            <div className="md:col-span-8">
              <Card className="bg-space-dark-blue border-gray-800">
                <CardHeader>
                  <CardTitle>Storage Containers</CardTitle>
                  <CardDescription>Select a container to view its items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {containers.map((container) => (
                      <StorageContainer
                        key={container.id}
                        container={container}
                        onClick={() => setSelectedContainer(container.name)}
                        className={selectedContainer === container.name ? 'ring-2 ring-blue-500' : ''}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 flex justify-end">
                <Dialog open={newItemDialogOpen} onOpenChange={setNewItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-space-blue text-white hover:bg-blue-600">
                      Add New Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-space-dark-blue border-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Cargo Item</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Item Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter item name"
                          value={newItem.name}
                          onChange={handleInputChange}
                          className="bg-space-darker-blue border-gray-700"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newItem.priority as string}
                            onValueChange={(value) => handleSelectChange('priority', value)}
                          >
                            <SelectTrigger className="bg-space-darker-blue border-gray-700">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent className="bg-space-dark-blue border-gray-700 text-white">
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={newItem.status as string}
                            onValueChange={(value) => handleSelectChange('status', value)}
                          >
                            <SelectTrigger className="bg-space-darker-blue border-gray-700">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-space-dark-blue border-gray-700 text-white">
                              <SelectItem value="stored">Stored</SelectItem>
                              <SelectItem value="in-transit">In Transit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Select
                          value={newItem.location as string}
                          onValueChange={(value) => handleSelectChange('location', value)}
                        >
                          <SelectTrigger className="bg-space-darker-blue border-gray-700">
                            <SelectValue placeholder="Select container" />
                          </SelectTrigger>
                          <SelectContent className="bg-space-dark-blue border-gray-700 text-white">
                            {containers.map((container) => (
                              <SelectItem key={container.id} value={container.name}>
                                {container.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            name="weight"
                            type="number"
                            placeholder="Weight in kg"
                            value={newItem.weight || ''}
                            onChange={handleInputChange}
                            className="bg-space-darker-blue border-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="volume">Volume (m³)</Label>
                          <Input
                            id="volume"
                            name="volume"
                            type="number"
                            placeholder="Volume in m³"
                            value={newItem.volume || ''}
                            onChange={handleInputChange}
                            className="bg-space-darker-blue border-gray-700"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-space-blue text-white hover:bg-blue-600"
                        onClick={handleAddItem}
                      >
                        Add Item
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Container details */}
            <div className="md:col-span-4">
              <Card className="bg-space-dark-blue border-gray-800">
                <CardHeader>
                  <CardTitle>
                    {selectedContainerData ? selectedContainerData.name : 'Container Details'}
                  </CardTitle>
                  <CardDescription>
                    {selectedContainerData 
                      ? `${containerItems.length} items, ${selectedContainerData.usedCapacity}/${selectedContainerData.capacity}m³ used`
                      : 'Select a container to view details'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!selectedContainerData && (
                    <div className="text-center text-gray-400 py-6">
                      <p>No container selected</p>
                      <p className="text-sm">Click on a container to view its details</p>
                    </div>
                  )}
                  
                  {selectedContainerData && containerItems.length === 0 && (
                    <div className="text-center text-gray-400 py-6">
                      <p>No items in this container</p>
                    </div>
                  )}
                  
                  {selectedContainerData && containerItems.length > 0 && (
                    <div className="space-y-4">
                      {containerItems.map((item) => (
                        <ItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card className="bg-space-dark-blue border-gray-800">
            <CardHeader>
              <CardTitle>Placement Recommendations</CardTitle>
              <CardDescription>Suggested placements for in-transit items based on priority and available space</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center text-gray-400 py-6">
                  <p>No placement recommendations available</p>
                  <p className="text-sm">All items have been assigned to appropriate containers</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.itemId} className="space-card p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{rec.itemName}</h3>
                          <p className="text-space-blue">Recommended: {rec.recommendedContainer}</p>
                          <p className="text-sm text-gray-400 mt-1">{rec.reason}</p>
                        </div>
                        <Button className="bg-space-blue text-white hover:bg-blue-600">
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import-export">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-space-dark-blue border-gray-800">
              <CardHeader>
                <CardTitle>Import Data</CardTitle>
                <CardDescription>Upload CSV files to import items or containers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Import Items</h3>
                  <CSVUploader 
                    onUpload={importItems}
                    label="Upload a CSV file with item data"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Import Containers</h3>
                  <CSVUploader 
                    onUpload={importContainers}
                    label="Upload a CSV file with container data"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-space-dark-blue border-gray-800">
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>Export current system data to CSV</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Export Current Arrangement</h3>
                    <p className="text-gray-400 mb-4">
                      Export all items with their current locations, priorities, and statuses
                    </p>
                    <Button 
                      className="bg-space-blue text-white hover:bg-blue-600 w-full"
                      onClick={exportCurrentArrangement}
                    >
                      Export to CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CargoPlacement;
