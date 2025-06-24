import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  const role = sessionStorage.getItem("roleName") || "Admin"; // fallback to 'admin' if null

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full"> 
        <div className="flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-6">
              Oops! The page you’re looking for doesn’t exist.
            </p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link to={`/${role}/user-management`}>Go back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
