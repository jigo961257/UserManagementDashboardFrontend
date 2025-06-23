// src/components/Cards.tsx

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardData } from "@/api/login/action";
// import { DashboardData } from "@/api/dashboard"; // Adjust path if needed

export default function Cards() {
  const [data, setData] = useState({
    totalRegisteredStudents: 0,
    totalEntities: 0,
    totalActiveUsers: 0,
    activeUsers24hrs: 0,
    totalEngagementTime: {
    hours: 0,
    minutes: 0,
  },
  });

  const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function fetchStats() {
    const res = await DashboardData();
    console.log("Dashboard Response:", res);

    if (res?.data?.dashboard) {
      setData(res.data.dashboard); // ✅ Only store the nested dashboard object
    }

    setLoading(false);
  }

  fetchStats();
}, []);


  const cards = [
    {
      title: "Total number of registered students",
      value: data.totalRegisteredStudents,
      icon:  <img
      src="/Icons/Frame.png"
      alt="Total Users"
      className="w-20 h-15 object-contain"
    />,
    },
    {
      title: "Total number of entities (e.g., Schools, Classes etc.)",
      value: data.totalEntities,
      icon: <img
      src="/Icons/Group.png"
      alt="Total Users"
      className="w-20 h-15 object-contain"
    />,
    },
    {
      title: "Total engagement time (Hrs)",
      value: (
        <>
          <span className="text-2xl font-bold">{data.totalEngagementTime.hours}</span>
          <span className="ml-1 text-xs font-thin ">Hrs</span>
          <span className="ml-2 text-xl font-bold">{data.totalEngagementTime.minutes}</span>
          <span className="ml-1 text-xs font-thin ">Mins</span>
        </>
      ),
      // icon: <Clock className="w-8 h-8 text-black" />,
    },
    {
      title: "Total Active Users",
      value: data.totalActiveUsers,
      // icon: <Users className="w-8 h-8 text-black" />,
    },
    {
      title: "Active Users (24 Hrs)",
      value: data.activeUsers24hrs,
      // icon: <UserCheck className="w-8 h-8 text-black" />,
      
    },
  ];

  if (loading) {
    return <div className="text-center mt-10 font-semibold">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 ml-5 gap-4">
      {cards.map((stat, idx) => (
        <Card
          key={idx}
          className="border border-orange-300 rounded-md shadow-sm"
        >
          <CardContent className="flex  justify-between pt-2 pb-4 px-5  h-full">
            <div className=" font-medium text-sm text-gray-700 leading-snug">
              {stat.title}
              <div className="text-2xl font-bold text-black">{stat.value}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>{stat.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
