import { Card, CardContent } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts"

const data = [
  { country: "United States", users: 3000 },
  { country: "China", users: 1500 },
  { country: "India", users: 2200 },
  { country: "Germany", users: 3400 },
  { country: "United Kingdom", users: 1800 },
  { country: "France", users: 400 },
  { country: "Japan", users: 6100 },
  { country: "Canada", users: 1300 },
  { country: "Australia", users: 4100 },
  { country: "Brazil", users: 6800 },
]

export default function UserDistributionChart() {
  const totalUsers = data.reduce((acc, cur) => acc + cur.users, 0)

  return (
    <Card className="border border-orange-300 rounded-md shadow-sm mt-5 ml-5">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">User Distribution</h2>
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            Country-wise user distribution
          </p>
          <p className="text-2xl font-bold text-black">{totalUsers.toLocaleString()}</p>
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
                // activeBar={false} // 👈 disables gray hover effect

                barSize={12}
                
              >
<LabelList dataKey="users" position="right" formatter={(val: number) => val.toLocaleString()} />
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#F97316" /> {/* orange */}
                  <stop offset="100%" stopColor="#DC2626" /> {/* red */}
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
