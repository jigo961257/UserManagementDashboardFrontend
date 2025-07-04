
import { useEffect, useState } from "react";
import Cards from "@/components/ui/Dashboard/Cards";
import TrendingContent from "@/components/ui/Dashboard/TrendingContent";
import StateDistribution from "@/components/ui/Dashboard/StateDistribution";
import UserDistribution from "@/components/ui/Dashboard/UserDistribution";

export default function DashboardHome() {
  const [_, setRoleName] = useState<string | null>("");

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role_name");
    setRoleName(storedRole);
  }, []);

  return (
    <>
      <div className="flex justify-between p-5">
        <div className="text-xl font-semibold">
          Welcome
        </div>
        <div className="p-3 rounded shadow-md" style={{ background: "#FBFBFB" }}>
          <p className="font-bold text-xs text-gray-800">
            Date: 17<sup>th</sup> June, 2025
          </p>
        </div>
      </div>
      <Cards />
      <UserDistribution/>
      <StateDistribution />
      <TrendingContent />
    </>
  );
}

