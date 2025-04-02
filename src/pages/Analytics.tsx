
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSpaceCargo } from '@/contexts/SpaceCargoContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package,
  ShieldAlert,
  Clock,
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const { items, containers, logs } = useSpaceCargo();
  const [timeRange, setTimeRange] = React.useState('week');
  
  // Calculate metrics
  const metrics = useMemo(() => {
    const totalItems = items.length;
    const usedCapacity = containers.reduce((sum, c) => sum + c.usedCapacity, 0);
    const totalCapacity = containers.reduce((sum, c) => sum + c.capacity, 0);
    const spaceUtilization = totalCapacity ? Math.round((usedCapacity / totalCapacity) * 100) : 0;
    
    const highPriorityItems = items.filter(i => i.priority === 'high').length;
    const mediumPriorityItems = items.filter(i => i.priority === 'medium').length;
    const lowPriorityItems = items.filter(i => i.priority === 'low').length;
    
    const wasteItems = items.filter(i => i.status === 'waste').length;
    const storedItems = items.filter(i => i.status === 'stored').length;
    const transitItems = items.filter(i => i.status === 'in-transit').length;
    
    return {
      totalItems,
      usedCapacity,
      totalCapacity,
      spaceUtilization,
      highPriorityItems,
      mediumPriorityItems,
      lowPriorityItems,
      wasteItems,
      storedItems,
      transitItems
    };
  }, [items, containers]);
  
  // Generate simulated historical data
  const historicalData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map(day => ({
      name: day,
      stored: 75 + Math.floor(Math.random() * 15),
      transit: 20 + Math.floor(Math.random() * 10),
      waste: 5 + Math.floor(Math.random() * 3)
    }));
  }, []);
  
  // Container utilization data
  const containerData = useMemo(() => {
    return containers.map(container => ({
      name: container.name,
      used: container.usedCapacity,
      free: container.capacity - container.usedCapacity
    }));
  }, [containers]);
  
  // Priority distribution data
  const priorityData = useMemo(() => {
    return [
      { name: 'High', value: metrics.highPriorityItems },
      { name: 'Medium', value: metrics.mediumPriorityItems },
      { name: 'Low', value: metrics.lowPriorityItems }
    ];
  }, [metrics]);
  
  // Efficiency metric data
  const efficiencyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      efficiency: 70 + Math.floor(Math.random() * 20),
    }));
  }, []);
  
  // Colors for charts
  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
  
  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-gray-400">Detailed insights and optimization metrics</p>
        </div>
        
        <Select 
          defaultValue="week" 
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="space-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Space Utilization</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold">{metrics.spaceUtilization}%</p>
                  <Badge className="ml-2 bg-green-500/20 text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    5%
                  </Badge>
                </div>
              </div>
              <div className="p-2 rounded-full bg-blue-500/20">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {metrics.usedCapacity} of {metrics.totalCapacity} cubic units used
            </p>
          </CardContent>
        </Card>
        
        <Card className="space-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Retrieval Efficiency</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold">85%</p>
                  <Badge className="ml-2 bg-green-500/20 text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    3%
                  </Badge>
                </div>
              </div>
              <div className="p-2 rounded-full bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Average retrieval time: 4.2 minutes
            </p>
          </CardContent>
        </Card>
        
        <Card className="space-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Waste Ratio</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold">
                    {metrics.totalItems ? Math.round((metrics.wasteItems / metrics.totalItems) * 100) : 0}%
                  </p>
                  <Badge className="ml-2 bg-red-500/20 text-red-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    2%
                  </Badge>
                </div>
              </div>
              <div className="p-2 rounded-full bg-red-500/20">
                <ShieldAlert className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {metrics.wasteItems} items marked as waste
            </p>
          </CardContent>
        </Card>
        
        <Card className="space-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Optimization Score</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold">92/100</p>
                  <Badge className="ml-2 bg-green-500/20 text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    7
                  </Badge>
                </div>
              </div>
              <div className="p-2 rounded-full bg-purple-500/20">
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Based on space usage and accessibility
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="space-card col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
              Inventory Trends
            </CardTitle>
            <CardDescription>Inventory status over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={historicalData}
                margin={{ top: 20, right: 30, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderColor: 'rgba(100, 116, 139, 0.4)',
                    borderRadius: '0.375rem',
                    color: 'white'
                  }}
                />
                <Legend />
                <Bar dataKey="stored" name="Stored" stackId="a" fill="#10B981" />
                <Bar dataKey="transit" name="In Transit" stackId="a" fill="#F59E0B" />
                <Bar dataKey="waste" name="Waste" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="space-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5 text-purple-500" />
              Priority Distribution
            </CardTitle>
            <CardDescription>Items by priority level</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderColor: 'rgba(100, 116, 139, 0.4)',
                    borderRadius: '0.375rem',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-blue-500" />
              Container Utilization
            </CardTitle>
            <CardDescription>Space usage by container</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={containerData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.3)" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.3)"
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        borderColor: 'rgba(100, 116, 139, 0.4)',
                        borderRadius: '0.375rem',
                        color: 'white'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="used" name="Used Space" stackId="a" fill="#3B82F6" />
                    <Bar dataKey="free" name="Free Space" stackId="a" fill="#1F2937" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="details">
                <div className="space-y-4 max-h-[250px] overflow-y-auto">
                  {containers.map((container) => (
                    <div 
                      key={container.id} 
                      className="p-3 rounded-md border border-gray-700 bg-black/20"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{container.name}</span>
                        <Badge variant="outline">
                          {Math.round((container.usedCapacity / container.capacity) * 100)}% Used
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            (container.usedCapacity / container.capacity * 100) > 80 ? "bg-red-500" :
                            (container.usedCapacity / container.capacity * 100) > 50 ? "bg-yellow-500" :
                            "bg-green-500"
                          }`}
                          style={{ width: `${(container.usedCapacity / container.capacity * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-400">{container.usedCapacity} used</span>
                        <span className="text-xs text-gray-400">{container.capacity} total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="space-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-500" />
              Efficiency Metrics
            </CardTitle>
            <CardDescription>System performance over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Tabs defaultValue="retrieval" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="retrieval">Retrieval Time</TabsTrigger>
                <TabsTrigger value="rotation">Stock Rotation</TabsTrigger>
              </TabsList>
              <TabsContent value="retrieval" className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={efficiencyData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                    <YAxis stroke="rgba(255,255,255,0.3)" />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        borderColor: 'rgba(100, 116, 139, 0.4)',
                        borderRadius: '0.375rem',
                        color: 'white'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      name="Efficiency (%)" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="rotation" className="h-[250px] flex flex-col justify-center items-center">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-500/20 text-blue-500">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold">17.3 days</p>
                    <p className="text-sm text-gray-400">Average stock rotation time</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-500/20 text-green-500">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-sm text-gray-400">FIFO compliance rate</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
