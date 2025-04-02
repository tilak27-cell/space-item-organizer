
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface ResourceUtilizationChartProps {
  type: 'storage' | 'consumption' | 'forecast';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444'];

const ResourceUtilizationChart = ({ type }: ResourceUtilizationChartProps) => {
  // Generate simulated data based on the chart type
  const data = useMemo(() => {
    if (type === 'storage') {
      return [
        { name: 'Module A', total: 120, used: 78 },
        { name: 'Module B', total: 100, used: 92 },
        { name: 'Module C', total: 150, used: 110 },
        { name: 'Module D', total: 80, used: 45 },
        { name: 'Module E', total: 90, used: 63 },
      ];
    } else if (type === 'consumption') {
      return [
        { name: 'Food', value: 35 },
        { name: 'Water', value: 25 },
        { name: 'Oxygen', value: 15 },
        { name: 'Medical', value: 10 },
        { name: 'Equipment', value: 10 },
        { name: 'Other', value: 5 },
      ];
    } else if (type === 'forecast') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return months.map(month => ({
        name: month,
        food: 30 + Math.random() * 10,
        water: 25 + Math.random() * 5,
        oxygen: 15 + Math.random() * 3,
        medical: 10 + Math.random() * 2,
      }));
    }
    return [];
  }, [type]);

  // Render different chart types based on prop
  const renderChart = () => {
    if (type === 'storage') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
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
            <Bar dataKey="total" name="Capacity" fill="#3B82F6" stackId="a" />
            <Bar dataKey="used" name="Used" fill="#10B981" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (type === 'consumption') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
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
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    } else if (type === 'forecast') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
            <Area type="monotone" dataKey="food" name="Food" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            <Area type="monotone" dataKey="water" name="Water" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="oxygen" name="Oxygen" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
            <Area type="monotone" dataKey="medical" name="Medical" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };

  return <div className="h-full">{renderChart()}</div>;
};

export default ResourceUtilizationChart;
