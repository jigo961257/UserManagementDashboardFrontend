import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { DashboardData } from "@/api/login/action"; // 🔁 Your actual API call

const COLORS = [
  "#e6194b", "#3cb44b", "#911eb4", "#ffe119", "#46f0f0",
  "#f58231", "#0082c8", "#f032e6", "#fabebe", "#e6beff"
];

export default function StateWisePieChart() {
  const [data, setData] = useState([]);
  console.log(data);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function fetchDistribution() {
    const result = await DashboardData();
    console.log("State Distribution:", result);

    if (result?.data?.stateDistribution?.states) {
      const formatted = result.data.stateDistribution.states.map((item:any) => ({
        name: item.state,         // recharts needs `name` key
        value: item.percentage,   // recharts uses `value` as size
      }));

      setData(formatted);

      // Optional: Total percentage (usually 100), or calculate total users if available
      const totalUsers = result.data.stateDistribution.totalUsers || 0;
      setTotal(totalUsers);
    }

    setLoading(false);
  }

  fetchDistribution();
}, []);


  if (loading) {
    return (
      <Card className="border border-orange-300 shadow-sm rounded-md mt-5 ml-5">
        <CardContent className="p-4">Loading Pie Chart...</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-orange-300 shadow-sm rounded-md mt-5 ml-5">
      <CardContent className="p-4">
        {/* <div className="mb-2">
          <h2 className="text-md font-semibold">State-wise user distribution</h2>
          <p className="text-2xl font-bold">{total.toLocaleString()}</p>
        </div> */}
 <div>
          <p className="text-sm mb-1 font-semibold">
            State-wise user distribution
          </p>
          <p className="text-2xl font-bold text-black">
            {total.toLocaleString()}
          </p>
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
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()} users`, "Users"]}
              contentStyle={{ border: "1px solid grey" }}
            />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
}
