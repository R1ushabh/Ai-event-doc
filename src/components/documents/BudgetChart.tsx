import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

interface BudgetChartProps {
  items: Array<{ item: string; cost: number; category: string }>;
}

const COLORS = [
  '#7C3AED', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#F43F5E', // Rose
  '#8B5CF6', // Violet
];

export const BudgetChart: React.FC<BudgetChartProps> = ({ items }) => {
  // Group by category
  const data = items.reduce((acc: any[], item) => {
    const existing = acc.find(d => d.name === item.category);
    if (existing) {
      existing.value += item.cost;
    } else {
      acc.push({ name: item.category, value: item.cost });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Budget']}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
