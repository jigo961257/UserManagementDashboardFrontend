import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "State A", value: 25 },
  { name: "State B", value: 25 },
  { name: "State C", value: 18 },
  { name: "State D", value: 15 },
  { name: "State E", value: 12 },
  { name: "State F", value: 10 },
  { name: "State G", value: 10 },
  { name: "State H", value: 8 },
  { name: "State I", value: 6 },
  { name: "State J", value: 5 },
];

const COLORS = [
  "#e6194b", "#3cb44b", "#911eb4", "#ffe119", "#46f0f0",
  "#f58231", "#0082c8", "#f032e6", "#fabebe", "#e6beff"
];

export default function StateWisePieChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border border-orange-300 shadow-sm rounded-md">
      <CardContent className="p-4">
        <div className="mb-2">
          <h2 className="text-md font-semibold">State-wise user distribution</h2>
          <p className="text-2xl font-bold">{total.toLocaleString()}</p>
        </div>

        <div className="flex justify-center">
          <PieChart width={400} height={280}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={({ value }) => value}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
}
