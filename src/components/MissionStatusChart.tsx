
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MissionStatusChart = () => {
  // Generate simulated mission data
  const data = useMemo(() => {
    const now = new Date();
    const hours = [];
    
    // Generate data for last 24 hours with 1-hour intervals
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      
      hours.push({
        time: `${time.getHours()}:00`,
        oxygen: 90 + Math.random() * 10 - Math.random() * 5,
        power: 85 + Math.random() * 15 - Math.random() * 5,
        temperature: 22 + Math.random() * 3 - Math.random() * 3,
      });
    }
    
    return hours;
  }, []);
  
  return (
    <div className="h-[250px]">
      <h3 className="text-md font-medium mb-2">24-Hour System Status</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10 }} 
            stroke="rgba(255,255,255,0.3)"
            tickFormatter={(value) => (Number(value.split(':')[0]) % 3 === 0) ? value : ''}
          />
          <YAxis tick={{ fontSize: 10 }} stroke="rgba(255,255,255,0.3)" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              borderColor: 'rgba(100, 116, 139, 0.4)',
              borderRadius: '0.375rem',
              color: 'white'
            }}
            itemStyle={{ padding: 0 }}
            labelStyle={{ marginBottom: '0.25rem' }}
          />
          <Line 
            type="monotone" 
            dataKey="oxygen" 
            name="Oxygen (%)" 
            stroke="#3B82F6" 
            activeDot={{ r: 5 }} 
            dot={false}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="power" 
            name="Power (%)"
            stroke="#10B981" 
            activeDot={{ r: 5 }}
            dot={false}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            name="Temp (°C)"
            stroke="#F59E0B" 
            activeDot={{ r: 5 }}
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MissionStatusChart;
