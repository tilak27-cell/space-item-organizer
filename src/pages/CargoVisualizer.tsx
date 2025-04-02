
import React, { useRef, useEffect, useState } from 'react';
import { useSpaceCargo } from '@/contexts/SpaceCargoContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BoxIcon, Box } from 'lucide-react';

const CargoVisualizer = () => {
  const { containers, items } = useSpaceCargo();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedContainer, setSelectedContainer] = useState<string>('all');
  const [viewMode, setViewMode] = useState<string>('2d');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    if (viewMode === '3d') {
      drawSimplified3D(ctx, canvas.width, canvas.height);
    } else {
      drawSimplified2D(ctx, canvas.width, canvas.height);
    }
  }, [selectedContainer, viewMode, containers, items]);
  
  const drawSimplified3D = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.4;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Simple box representation
    const faces = [
      { points: [[-size, -size], [size, -size], [size, size], [-size, size]], color: 'rgba(59, 130, 246, 0.2)', stroke: '#3B82F6' },
      { points: [[size, -size], [size * 1.3, -size * 0.7], [size * 1.3, size * 0.7], [size, size]], color: 'rgba(59, 130, 246, 0.3)', stroke: '#3B82F6' },
      { points: [[-size, -size], [size, -size], [size * 1.3, -size * 0.7], [-size * 0.7, -size * 1.3]], color: 'rgba(59, 130, 246, 0.4)', stroke: '#3B82F6' },
    ];
    
    faces.forEach(face => {
      ctx.beginPath();
      ctx.moveTo(face.points[0][0], face.points[0][1]);
      face.points.forEach((point, i) => {
        if (i > 0) ctx.lineTo(point[0], point[1]);
      });
      ctx.closePath();
      ctx.fillStyle = face.color;
      ctx.strokeStyle = face.stroke;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    });
    
    // Draw some boxes inside to represent items
    const numItems = Math.min(items.length, 8);
    for (let i = 0; i < numItems; i++) {
      const itemSize = size * 0.2;
      const x = (Math.random() * 1.6 - 0.8) * size * 0.8;
      const y = (Math.random() * 1.6 - 0.8) * size * 0.8;
      
      const priorityColors = {
        high: 'rgba(239, 68, 68, 0.8)',
        medium: 'rgba(245, 158, 11, 0.8)',
        low: 'rgba(16, 185, 129, 0.8)',
      };
      
      const itemPriority = items[i]?.priority || 'medium';
      const color = priorityColors[itemPriority as keyof typeof priorityColors];
      
      ctx.fillStyle = color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      
      ctx.fillRect(x - itemSize/2, y - itemSize/2, itemSize, itemSize);
      ctx.strokeRect(x - itemSize/2, y - itemSize/2, itemSize, itemSize);
    }
    
    ctx.restore();
    
    drawGrid(ctx, width, height);
  };
  
  const drawSimplified2D = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.4;
    
    // Draw container outline
    ctx.beginPath();
    ctx.rect(centerX - size, centerY - size, size * 2, size * 2);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw simple grid
    const sections = 4;
    for (let i = 1; i < sections; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX - size, centerY - size + (size * 2 / sections) * i);
      ctx.lineTo(centerX + size, centerY - size + (size * 2 / sections) * i);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.stroke();
    }
    
    // Draw items as simple squares
    const numItems = Math.min(items.length, 16);
    const itemWidth = (size * 2) / 4;
    const itemHeight = (size * 2) / 4;
    
    for (let i = 0; i < numItems; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      
      const x = centerX - size + col * itemWidth;
      const y = centerY - size + row * itemHeight;
      
      const priorityColors = {
        high: 'rgba(239, 68, 68, 0.8)',
        medium: 'rgba(245, 158, 11, 0.8)',
        low: 'rgba(16, 185, 129, 0.8)',
      };
      
      const itemPriority = items[i]?.priority || 'medium';
      const color = priorityColors[itemPriority as keyof typeof priorityColors];
      
      ctx.fillStyle = color;
      ctx.fillRect(x + 4, y + 4, itemWidth - 8, itemHeight - 8);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(x + 4, y + 4, itemWidth - 8, itemHeight - 8);
    }
  };
  
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 30;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    
    ctx.stroke();
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cargo Visualizer</h1>
          <p className="text-gray-400">Visualization of cargo placement</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="space-card lg:col-span-3">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <BoxIcon className="mr-2 h-5 w-5 text-space-blue" />
                Cargo Visualization
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="mb-4 flex justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-40">
                  <Select value={selectedContainer} onValueChange={setSelectedContainer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select container" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Containers</SelectItem>
                      {containers.map((container) => (
                        <SelectItem key={container.id} value={container.id}>
                          {container.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Tabs defaultValue="2d" value={viewMode} onValueChange={setViewMode}>
                  <TabsList>
                    <TabsTrigger value="3d">3D View</TabsTrigger>
                    <TabsTrigger value="2d">Top View</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-space-blue/20 text-space-blue">
                  <Box className="h-3 w-3 mr-1" />
                  {items.length} Items
                </Badge>
                <Badge variant="outline" className="bg-green-500/20 text-green-500">
                  {containers.length} Containers
                </Badge>
              </div>
            </div>
            
            <div className="relative w-full h-[500px] border border-gray-800 rounded-lg overflow-hidden">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full bg-gray-900/50"
              />
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              <p>Simple visualization of cargo placement.</p>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <Card className="space-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Box className="mr-2 h-5 w-5 text-space-blue" />
                Container Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedContainer === 'all' ? (
                  <div className="space-y-2">
                    <p>All containers selected</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-md border border-gray-700 p-2">
                        <p className="text-xs text-gray-400">Total Items</p>
                        <p className="text-lg font-medium">{items.length}</p>
                      </div>
                      <div className="rounded-md border border-gray-700 p-2">
                        <p className="text-xs text-gray-400">Containers</p>
                        <p className="text-lg font-medium">{containers.length}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {containers
                      .filter(c => c.id === selectedContainer)
                      .map(container => (
                        <div key={container.id} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{container.name}</h4>
                            <Badge>{container.usedCapacity}/{container.capacity}</Badge>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (container.usedCapacity / container.capacity * 100) > 80 ? "bg-red-500" :
                                (container.usedCapacity / container.capacity * 100) > 50 ? "bg-yellow-500" :
                                "bg-green-500"
                              }`}
                              style={{ width: `${(container.usedCapacity / container.capacity * 100)}%` }}
                            ></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-md border border-gray-700 p-2">
                              <p className="text-xs text-gray-400">Items</p>
                              <p className="text-lg font-medium">
                                {items.filter(i => i.location === container.id).length}
                              </p>
                            </div>
                            <div className="rounded-md border border-gray-700 p-2">
                              <p className="text-xs text-gray-400">Location</p>
                              <p className="text-lg font-medium">{container.location}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CargoVisualizer;
