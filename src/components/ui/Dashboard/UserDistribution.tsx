import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { DashboardData } from "@/api/login/action";

export default function userDistribution() {
  const [data, setData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await DashboardData();
      console.log(result);
      if (result?.data?.userDistribution) {
      setData(result.data.userDistribution.countries || []);
      setTotalUsers(result.data.userDistribution.totalUsers || 0);
    }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="border border-orange-300 rounded-md shadow-sm mt-5 ml-5">
        <CardContent className="p-6">Loading chart...</CardContent>
      </Card>
    );
  }

  return (
    <div>

        <h2 className="text-3xl font-[400] ml-5" style={{marginTop:"40px"}}>User Distribution</h2>
    <Card className="border border-orange-300 rounded-md shadow-sm mt-3 ml-5">
      <CardContent className="px-12 py-8 space-y-4">
        <div>
          <p className="text-sm mb-1 font-semibold">
            Country-wise user distribution
          </p>
          <p className="text-2xl font-bold text-black">
            {totalUsers.toLocaleString()}
          </p>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(val) => `${val / 1000}K`} />
              <YAxis dataKey="country" type="category" width={120} />
              <Tooltip />
              <Bar
                dataKey="users"
                fill="url(#colorGradient)"
                radius={[0, 10, 10, 0]}
                barSize={12}
              >
                <LabelList
                  dataKey="users"
                  position="right"
                  formatter={(val: number) => val.toLocaleString()}
                />
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
