import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MissionStatusChart from '@/components/MissionStatusChart';
import ResourceUtilizationChart from '@/components/ResourceUtilizationChart';
import OptimizerRecommendations from '@/components/OptimizerRecommendations';
import { useSpaceCargo } from '@/contexts/SpaceCargoContext';
import { AlertCircle, CheckCircle, BarChart2, Rocket, Zap, Settings, Download, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const MissionControl = () => {
  const { containers, items } = useSpaceCargo();
  const [activeTab, setActiveTab] = useState('overview');

  const optimizeCargoPlacement = () => {
    console.log("Optimizing cargo placement...");
    // In a real implementation, this would call the context's function
  };
  
  const recommendations = [
    {
      id: 1,
      title: "Redistribute High Priority Items",
      description: "Move 3 high-priority medical supplies to front-accessible containers",
      impact: "high",
      timeEstimate: "5 min"
    },
    {
      id: 2,
      title: "Consolidate Food Storage",
      description: "Group similar food items to optimize space usage by 15%",
      impact: "medium",
      timeEstimate: "15 min"
    },
    {
      id: 3,
      title: "Tag Expiring Items",
      description: "Mark 7 items expiring in the next 30 days for easier access",
      impact: "medium",
      timeEstimate: "10 min"
    }
  ];
  
  const missionStats = {
    daysInOrbit: 136,
    daysRemaining: 92,
    storageUtilization: 73,
    itemsProcessed: 1458,
    currentAstronauts: 6,
    nextResupply: "18 days"
  };
  
  const missionAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Container B7 approaching capacity (93%)",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "info",
      message: "Scheduled inventory check in 3 days",
      time: "1 day ago"
    },
    {
      id: 3,
      type: "success",
      message: "Resupply mission schedule confirmed",
      time: "2 days ago"
    }
  ];
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mission Control Center</h1>
          <p className="text-gray-400">Cargo analytics and optimization dashboard</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <UploadCloud size={16} />
            Sync Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="space-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="mr-2 h-5 w-5 text-blue-400" />
                Mission Progress
              </CardTitle>
              <CardDescription>Day {missionStats.daysInOrbit} of {missionStats.daysInOrbit + missionStats.daysRemaining}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Mission Timeline</span>
                    <span className="text-sm font-medium">{Math.round((missionStats.daysInOrbit / (missionStats.daysInOrbit + missionStats.daysRemaining)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((missionStats.daysInOrbit / (missionStats.daysInOrbit + missionStats.daysRemaining)) * 100)} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-800 p-3">
                    <p className="text-xs text-gray-400">Next Resupply</p>
                    <p className="text-lg font-semibold">{missionStats.nextResupply}</p>
                  </div>
                  <div className="rounded-lg border border-gray-800 p-3">
                    <p className="text-xs text-gray-400">Crew Size</p>
                    <p className="text-lg font-semibold">{missionStats.currentAstronauts}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="space-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-green-400" />
                Storage Status
              </CardTitle>
              <CardDescription>Current utilization and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Overall Capacity Used</span>
                    <span className="text-sm font-medium">{missionStats.storageUtilization}%</span>
                  </div>
                  <Progress 
                    value={missionStats.storageUtilization} 
                    className={`h-2 ${
                      missionStats.storageUtilization > 90 ? 'bg-red-500' : 
                      missionStats.storageUtilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-800 p-3">
                    <p className="text-xs text-gray-400">Total Items</p>
                    <p className="text-lg font-semibold">{items.length}</p>
                  </div>
                  <div className="rounded-lg border border-gray-800 p-3">
                    <p className="text-xs text-gray-400">Containers</p>
                    <p className="text-lg font-semibold">{containers.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="space-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-purple-400" />
                System Status
              </CardTitle>
              <CardDescription>Alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {missionAlerts.map(alert => (
                  <div key={alert.id} className="flex items-start space-x-3 p-2 rounded-md bg-gray-900/50">
                    <div className={`mt-0.5 ${
                      alert.type === 'warning' ? 'text-yellow-500' : 
                      alert.type === 'success' ? 'text-green-500' : 'text-blue-500'
                    }`}>
                      {alert.type === 'warning' && <AlertCircle size={16} />}
                      {alert.type === 'success' && <CheckCircle size={16} />}
                      {alert.type === 'info' && <Settings size={16} />}
                    </div>
                    <div>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">View All Alerts</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card className="space-card">
                <CardHeader>
                  <CardTitle>Mission Status Overview</CardTitle>
                  <CardDescription>Cargo management performance</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <MissionStatusChart />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-4">
              <Card className="space-card">
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                  <CardDescription>Storage and supplies analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResourceUtilizationChart type="storage" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4">
              <Card className="space-card">
                <CardHeader>
                  <CardTitle>Mission Timeline</CardTitle>
                  <CardDescription>Schedule and key events</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <p className="text-gray-400">Timeline visualization will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card className="space-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-blue-400" />
                Optimization Engine
              </CardTitle>
              <CardDescription>AI-powered recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map(recommendation => (
                <OptimizerRecommendations 
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={optimizeCargoPlacement}
                className="w-full"
              >
                Run Full Optimization
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MissionControl;
