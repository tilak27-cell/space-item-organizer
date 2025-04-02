
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSpaceCargo } from '@/contexts/SpaceCargoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cube, Search, RotateCw, Layers, Box, Maximize2, Minimize2 } from 'lucide-react';

const CargoVisualizer = () => {
  const { containers, items } = useSpaceCargo();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedContainer, setSelectedContainer] = useState<string>('all');
  const [viewMode, setViewMode] = useState<string>('3d');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [heatmap, setHeatmap] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  
  // Visualization logic would use Three.js in a real implementation
  // Here we'll simulate with canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Draw simulated 3D cargo visualization
    if (viewMode === '3d') {
      drawSimulated3D(ctx, canvas.width, canvas.height);
    } else {
      drawSimulated2D(ctx, canvas.width, canvas.height);
    }
    
    // Animation loop for rotation
    let animationId: number;
    if (autoRotate) {
      let rotation = 0;
      const animate = () => {
        rotation += 0.01;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (viewMode === '3d') {
          drawSimulated3D(ctx, canvas.width, canvas.height, rotation);
        } else {
          drawSimulated2D(ctx, canvas.width, canvas.height);
        }
        
        animationId = requestAnimationFrame(animate);
      };
      animate();
    }
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [selectedContainer, viewMode, heatmap, autoRotate, containers, items]);
  
  // Simulated 3D drawing
  const drawSimulated3D = (ctx: CanvasRenderingContext2D, width: number, height: number, rotation = 0) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.4;
    
    // Draw container as a 3D cube
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    
    // Draw cube faces with perspective
    const faces = [
      // Front face
      { points: [[-size, -size], [size, -size], [size, size], [-size, size]], color: 'rgba(59, 130, 246, 0.2)', stroke: '#3B82F6' },
      // Right face
      { points: [[size, -size], [size * 1.3, -size * 0.7], [size * 1.3, size * 0.7], [size, size]], color: 'rgba(59, 130, 246, 0.3)', stroke: '#3B82F6' },
      // Top face
      { points: [[-size, -size], [size, -size], [size * 1.3, -size * 0.7], [-size * 0.7, -size * 1.3]], color: 'rgba(59, 130, 246, 0.4)', stroke: '#3B82F6' },
    ];
    
    // Draw basic faces
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
    
    // Draw some cargo items inside
    const numItems = Math.min(items.length, 15);
    for (let i = 0; i < numItems; i++) {
      const itemSize = size * 0.15;
      const x = (Math.random() * 1.6 - 0.8) * size;
      const y = (Math.random() * 1.6 - 0.8) * size;
      const z = Math.random() * 0.3; // Simulated depth
      
      // Different colors based on priority
      const priorityColors = {
        high: 'rgba(239, 68, 68, 0.8)',
        medium: 'rgba(245, 158, 11, 0.8)',
        low: 'rgba(16, 185, 129, 0.8)',
      };
      
      const itemPriority = items[i]?.priority || 'medium';
      const color = priorityColors[itemPriority as keyof typeof priorityColors];
      
      // Draw simple box
      ctx.fillStyle = color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.9 - z * 0.3; // Fade based on depth
      
      ctx.fillRect(x - itemSize/2, y - itemSize/2, itemSize, itemSize);
      ctx.strokeRect(x - itemSize/2, y - itemSize/2, itemSize, itemSize);
    }
    
    // Reset alpha
    ctx.globalAlpha = 1;
    
    // Draw glowing effects for futuristic look
    const gradient = ctx.createRadialGradient(0, 0, size * 0.1, 0, 0, size * 2);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-size * 2, -size * 2, size * 4, size * 4);
    
    ctx.restore();
    
    // Add grid overlay
    drawGrid(ctx, width, height);
  };
  
  // Simulated 2D drawing (top-down view)
  const drawSimulated2D = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.4;
    
    // Draw container outline
    ctx.beginPath();
    ctx.rect(centerX - size, centerY - size, size * 2, size * 2);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw container sections
    const sections = 4;
    for (let i = 1; i < sections; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX - size, centerY - size + (size * 2 / sections) * i);
      ctx.lineTo(centerX + size, centerY - size + (size * 2 / sections) * i);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.stroke();
    }
    
    // Draw items as blocks
    const numItems = Math.min(items.length, 25);
    const itemWidth = (size * 2) / 5;
    const itemHeight = (size * 2) / 5;
    
    for (let i = 0; i < numItems; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      
      const x = centerX - size + col * itemWidth;
      const y = centerY - size + row * itemHeight;
      
      // Different colors based on priority
      const priorityColors = {
        high: 'rgba(239, 68, 68, 0.8)',
        medium: 'rgba(245, 158, 11, 0.8)',
        low: 'rgba(16, 185, 129, 0.8)',
      };
      
      const itemPriority = items[i]?.priority || 'medium';
      const color = priorityColors[itemPriority as keyof typeof priorityColors];
      
      // Draw box
      ctx.fillStyle = color;
      ctx.fillRect(x + 4, y + 4, itemWidth - 8, itemHeight - 8);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(x + 4, y + 4, itemWidth - 8, itemHeight - 8);
      
      // Draw item ID or abbreviated name
      ctx.fillStyle = 'white';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const itemName = items[i]?.name || '';
      const shortName = itemName.length > 8 ? itemName.substring(0, 5) + '...' : itemName;
      ctx.fillText(shortName, x + itemWidth/2, y + itemHeight/2);
    }
    
    // Draw heatmap overlay
    if (heatmap) {
      const heatmapData = generateSimulatedHeatmap(width, height, centerX, centerY, size);
      ctx.putImageData(heatmapData, 0, 0);
    }
  };
  
  // Draw grid overlay
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 30;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    
    // Horizontal lines
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    
    ctx.stroke();
  };
  
  // Generate simulated heatmap data
  const generateSimulatedHeatmap = (width: number, height: number, centerX: number, centerY: number, size: number) => {
    const imageData = new ImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Calculate distance from center to determine heat intensity
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only show heatmap within container bounds
        if (Math.abs(dx) < size && Math.abs(dy) < size) {
          // Add some variation
          const noise = Math.sin(x / 10) * Math.cos(y / 10) * 20;
          const intensity = Math.max(0, 255 - distance * 0.5 - noise);
          
          // Red heat map with some transparency
          data[index] = intensity;       // R
          data[index + 1] = 0;           // G
          data[index + 2] = 100;         // B
          data[index + 3] = intensity * 0.4; // A
        } else {
          // Outside container is transparent
          data[index + 3] = 0;
        }
      }
    }
    
    return imageData;
  };
  
  // Toggle fullscreen
  const toggleFullScreen = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (!isFullScreen) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullScreen(!isFullScreen);
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">3D Cargo Visualizer</h1>
          <p className="text-gray-400">Interactive visualization of cargo placement</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="space-card lg:col-span-3">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Cube className="mr-2 h-5 w-5 text-space-blue" />
                Cargo Visualization
              </CardTitle>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={autoRotate ? "bg-space-blue/20" : ""}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Auto-Rotate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setHeatmap(!heatmap)}
                  className={heatmap ? "bg-space-blue/20" : ""}
                >
                  <Layers className="h-4 w-4 mr-1" />
                  Heatmap
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
                
                <Tabs defaultValue="3d" value={viewMode} onValueChange={setViewMode}>
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
            
            {/* Canvas for visualization */}
            <motion.div 
              className="relative w-full h-[500px] border border-gray-800 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <canvas 
                ref={canvasRef} 
                className="w-full h-full bg-gray-900/50"
              />
              
              {/* Overlay text showing it's a visualization */}
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                Interactive Visualization
              </div>
            </motion.div>
            
            <div className="mt-4 text-sm text-gray-400">
              <p>
                Note: This is a simplified visualization. Click and drag to rotate in 3D view. 
                Use mouse wheel to zoom.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
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
                                {items.filter(i => i.container === container.id).length}
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
                
                <Button className="w-full" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Find Item
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="space-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5 text-yellow-500" />
                Item Distribution
              </CardTitle>
              <CardDescription>By priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* High Priority */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">High Priority</span>
                    <span className="text-sm font-medium text-red-500">
                      {items.filter(i => i.priority === 'high').length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-red-500"
                      style={{ width: `${(items.filter(i => i.priority === 'high').length / items.length * 100) || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Medium Priority */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Medium Priority</span>
                    <span className="text-sm font-medium text-yellow-500">
                      {items.filter(i => i.priority === 'medium').length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-yellow-500"
                      style={{ width: `${(items.filter(i => i.priority === 'medium').length / items.length * 100) || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Low Priority */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Low Priority</span>
                    <span className="text-sm font-medium text-green-500">
                      {items.filter(i => i.priority === 'low').length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-green-500"
                      style={{ width: `${(items.filter(i => i.priority === 'low').length / items.length * 100) || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CargoVisualizer;
