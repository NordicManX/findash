'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  account_id: string;
};

// Desativamos a checagem chata de "any" exclusivamente para o Tooltip do Recharts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const isIncome = payload[0].payload.name === 'Receitas';
    return (
      <div
        className={`border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isIncome ? 'bg-green-400 text-black' : 'bg-red-500 text-white'}`}
      >
        <p className="font-black uppercase">{payload[0].payload.name}</p>
        <p className="text-lg font-bold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// Desativamos a checagem chata de "any" exclusivamente para o Ponto do Recharts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const isIncome = payload.name === 'Receitas';
  return (
    <circle
      key={`dot-${payload.name}`}
      cx={cx}
      cy={cy}
      r={8}
      stroke="#000"
      strokeWidth={4}
      fill={isIncome ? '#4ade80' : '#ef4444'}
      className="hover:r-[12px] transition-all"
    />
  );
};

export function AnalyticsChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const data = [
    { name: 'Receitas', valor: totalIncome },
    { name: 'Despesas', valor: totalExpense },
  ];

  return (
    <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-6">
      <h3 className="mb-6 inline-block w-fit border-b-4 border-black pb-2 text-xl font-black text-black uppercase">
        Balanço Geral
      </h3>

      <div className="h-[300px] w-full text-xs font-bold md:text-sm">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: -10, bottom: 10 }}
          >
            <CartesianGrid
              stroke="#000"
              strokeWidth={2}
              opacity={0.1}
              vertical={false}
            />

            <XAxis
              dataKey="name"
              stroke="#000"
              strokeWidth={3}
              tickLine={false}
              axisLine={{ strokeWidth: 4 }}
              tickMargin={15}
            />

            <YAxis
              stroke="#000"
              strokeWidth={3}
              tickLine={false}
              axisLine={{ strokeWidth: 4 }}
              tickFormatter={(val) => `R$ ${val}`}
              tickMargin={10}
            />

            <Tooltip
              cursor={{
                stroke: '#000',
                strokeWidth: 2,
                strokeDasharray: '5 5',
              }}
              content={<CustomTooltip />}
            />

            <Line
              type="monotone"
              dataKey="valor"
              stroke="#000"
              strokeWidth={5}
              dot={renderCustomDot}
              activeDot={{ r: 12, stroke: '#000', strokeWidth: 4 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
