// src/Dashboard/DashboardHome.tsx
import Cards from "@/Dashboard/card";
import UserDistributionChart from "@/Dashboard/userDistribution";
import StateWisePieChart from "@/Dashboard/StateDistribution";
import TrendingContent from "@/Dashboard/TrendingContent";

export default function DashboardHome() {
  return (
    <>
    <div className="flex justify-between p-5">
      <div className="text-xl font-semibold">
        Dashboard
      </div>
      <div className="bg-gray-100">
        <p className="font-bold text-xs text-gray-800">Date: 17<sup>th</sup> June, 2025</p>
      </div>
    </div>
      <Cards />
      <UserDistributionChart />
      <StateWisePieChart />
      <TrendingContent />
    </>
  );
}
