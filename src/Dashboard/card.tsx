import {
  GraduationCap,
  Building2,
  Clock,
  Users,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Total number of registered students",
    value: "250",
    icon: <GraduationCap className="w-8 h-8 text-black" />,
  },
  {
    title: "Total number of entities (e.g., Schools, Classes etc.)",
    value: "250",
    icon: <Building2 className="w-8 h-8 text-black" />,
  },
  {
    title: "Total engagement time (Hrs)",
    value: (
      <>
        <span className="text-2xl font-bold">150</span>
        <span className="ml-1 text-sm font-semibold">Hrs</span>
        <span className="ml-2 text-xl font-bold">30</span>
        <span className="ml-1 text-sm font-semibold">Mins</span>
      </>
    ),
    icon: <Clock className="w-8 h-8 text-black" />,
  },
  {
    title: "Total Active Users",
    value: "1000",
    icon: <Users className="w-8 h-8 text-black" />,
  },
  {
    title: "Active Users (24 Hrs)",
    value: "569",
    icon: <UserCheck className="w-8 h-8 text-black" />,
  },
];

export default function Cards() {
  return (
    <div className="grid grid-cols-3 ml-5 gap-4">
      {stats.map((stat, idx) => (
        <Card
          key={idx}
          className="border border-orange-300 rounded-md shadow-sm"
        >
          <CardContent className="flex flex-col justify-between h-full p-4 space-y-4">
            <div className="text-sm font-medium text-gray-700 leading-snug">
              {stat.title}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-black">
                {stat.value}
              </div>
              <div className="">{stat.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
