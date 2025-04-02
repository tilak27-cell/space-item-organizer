
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSpaceCargo } from '@/contexts/SpaceCargoContext';
import { Rocket, AlertTriangle, Check, BarChart3, Waves, PieChart, Activity, ShieldCheck } from 'lucide-react';
import MissionStatusChart from '@/components/MissionStatusChart';
import ResourceUtilizationChart from '@/components/ResourceUtilizationChart';
import OptimizerRecommendations from '@/components/OptimizerRecommendations';
import { motion } from 'framer-motion';

const MissionControl = () => {
  const { items, containers, logs, optimizeCargoPlacement, getWasteItems, getActiveItems } = useSpaceCargo();
  const [missionStatus, setMissionStatus] = useState('nominal');
  const [oxygenLevel, setOxygenLevel] = useState(94);
  const [powerLevel, setPowerLevel] = useState(87);
  const [fuelLevel, setFuelLevel] = useState(76);
  const [waterLevel, setWaterLevel] = useState(82);
  const [recommendations, setRecommendations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Simulate mission metrics
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random fluctuations to simulate real-time data
      setOxygenLevel(prev => Math.min(100, Math.max(70, prev + (Math.random() * 2 - 1))));
      setPowerLevel(prev => Math.min(100, Math.max(60, prev + (Math.random() * 2 - 1))));
      setFuelLevel(prev => Math.min(100, Math.max(50, prev - (Math.random() * 0.2))));
      setWaterLevel(prev => Math.min(100, Math.max(65, prev + (Math.random() * 2 - 1))));
    }, 5000);
    
    // Generate initial alerts
    setAlerts([
      {
        id: 1,
        type: 'warning',
        message: 'Oxygen filter efficiency decreased by 3%',
        time: '10:24 AM',
        resolved: false
      },
      {
        id: 2,
        type: 'info',
        message: 'Scheduled cargo transfer at 14:30',
        time: '09:15 AM',
        resolved: true
      },
      {
        id: 3,
        type: 'critical',
        message: 'Medical supplies in Module B approaching expiration',
        time: '08:47 AM',
        resolved: false
      }
    ]);
    
    // Generate AI recommendations based on cargo data
    const wasteItems = getWasteItems();
    const activeItems = getActiveItems();
    
    const newRecommendations = [
      {
        id: 1,
        title: 'Optimize Storage Layout',
        description: 'Rearranging cargo modules B and C can increase storage efficiency by 12%',
        impact: 'high',
        timeEstimate: '45 min',
      },
      {
        id: 2,
        title: 'Waste Management',
        description: `Schedule waste disposal for ${wasteItems.length} expired items`,
        impact: 'medium',
        timeEstimate: '30 min',
      },
      {
        id: 3,
        title: 'Critical Items Access',
        description: 'Move medical supplies to high accessibility zone',
        impact: 'high',
        timeEstimate: '20 min',
      }
    ];
    
    setRecommendations(newRecommendations);
    
    return () => clearInterval(interval);
  }, [getWasteItems, getActiveItems]);
  
  // Calculate mission metrics
  const resourceEfficiency = Math.round((oxygenLevel + powerLevel + fuelLevel + waterLevel) / 4);
  const storageUtilization = containers.length > 0 
    ? Math.round((containers.reduce((acc, c) => acc + c.usedCapacity, 0) / containers.reduce((acc, c) => acc + c.capacity, 0)) * 100) 
    : 0;
  
  const getStatusColor = (value) => {
    if (value > 85) return 'bg-green-500';
    if (value > 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const handleOptimize = () => {
    optimizeCargoPlacement();
  };
  
  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Mission Control Center</h1>
          <p className="text-gray-400">Real-time monitoring and advanced cargo optimization</p>
        </div>
        
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-green-500/20 text-green-500 px-3 py-1 flex items-center gap-1">
            <Check size={14} />
            <span>Systems Nominal</span>
          </Badge>
          <Button className="bg-space-blue hover:bg-blue-600" onClick={handleOptimize}>
            <ShieldCheck className="mr-2 h-4 w-4" /> Optimize All Systems
          </Button>
        </div>
      </motion.div>
      
      {/* Mission Status Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="space-card col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-space-blue" />
              Mission Status
            </CardTitle>
            <CardDescription>Current mission metrics and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Oxygen Level */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Oxygen</span>
                  <span className={`text-sm font-medium ${oxygenLevel > 85 ? 'text-green-500' : oxygenLevel > 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {Math.round(oxygenLevel)}%
                  </span>
                </div>
                <Progress value={oxygenLevel} className={getStatusColor(oxygenLevel)} />
              </div>
              
              {/* Power Level */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Power</span>
                  <span className={`text-sm font-medium ${powerLevel > 85 ? 'text-green-500' : powerLevel > 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {Math.round(powerLevel)}%
                  </span>
                </div>
                <Progress value={powerLevel} className={getStatusColor(powerLevel)} />
              </div>
              
              {/* Fuel Level */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fuel</span>
                  <span className={`text-sm font-medium ${fuelLevel > 85 ? 'text-green-500' : fuelLevel > 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {Math.round(fuelLevel)}%
                  </span>
                </div>
                <Progress value={fuelLevel} className={getStatusColor(fuelLevel)} />
              </div>
              
              {/* Water Level */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Water</span>
                  <span className={`text-sm font-medium ${waterLevel > 85 ? 'text-green-500' : waterLevel > 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {Math.round(waterLevel)}%
                  </span>
                </div>
                <Progress value={waterLevel} className={getStatusColor(waterLevel)} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MissionStatusChart />
              <div>
                <h3 className="text-md font-medium mb-2">Mission Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resource Efficiency</span>
                    <Badge className={`${resourceEfficiency > 85 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {resourceEfficiency}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Utilization</span>
                    <Badge className={`${storageUtilization > 90 ? 'bg-red-500' : storageUtilization > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                      {storageUtilization}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cargo Items</span>
                    <Badge variant="outline">{items.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Containers</span>
                    <Badge variant="outline">{containers.length}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* AI Recommendations Card */}
        <Card className="space-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Rocket className="mr-2 h-5 w-5 text-purple-500" />
              AI Recommendations
            </CardTitle>
            <CardDescription>System-generated optimization suggestions</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <OptimizerRecommendations key={rec.id} recommendation={rec} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resource Utilization and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="space-card col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-space-blue" />
              Resource Utilization
            </CardTitle>
            <CardDescription>Detailed analysis of mission resources</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <Tabs defaultValue="storage">
              <TabsList className="mb-4">
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="consumption">Consumption</TabsTrigger>
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
              </TabsList>
              <TabsContent value="storage" className="h-[300px]">
                <ResourceUtilizationChart type="storage" />
              </TabsContent>
              <TabsContent value="consumption" className="h-[300px]">
                <ResourceUtilizationChart type="consumption" />
              </TabsContent>
              <TabsContent value="forecast" className="h-[300px]">
                <ResourceUtilizationChart type="forecast" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="space-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              System Alerts
            </CardTitle>
            <CardDescription>Recent alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={`
                  ${alert.type === 'critical' ? 'border-red-500 bg-red-500/10' : 
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10' : 
                    'border-blue-500 bg-blue-500/10'}
                  ${alert.resolved ? 'opacity-60' : ''}
                `}>
                  <div className="flex justify-between">
                    <AlertTitle className={`
                      ${alert.type === 'critical' ? 'text-red-500' : 
                        alert.type === 'warning' ? 'text-yellow-500' : 
                        'text-blue-500'}
                    `}>
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </AlertTitle>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <AlertDescription>
                    {alert.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissionControl;
