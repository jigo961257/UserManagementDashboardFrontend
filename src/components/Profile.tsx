import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// import { Card, CardContent } from "@/components/ui/card"; // ❌ Card components removed

// API થી મળતા ડેટાના આધારે ઇન્ટરફેસ વ્યાખ્યાયિત કરો
interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarImage?: string; // જો API રિસ્પોન્સમાં અવતાર ઈમેજ URL હોય
  // રોલ-વિશિષ્ટ ફીલ્ડ્સ અહીં ઉમેરો, ઉદાહરણ તરીકે:
  studentId?: string;
  major?: string;
  employeeId?: string;
  department?: string;
  qualifications?: string;
  // અન્ય ફીલ્ડ્સ જે તમારા API રિસ્પોન્સમાં હોઈ શકે છે
  // દા.ત., _id, roleName
  _id?: string;
  roleName?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = useCallback(async (id: string, roleName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("accessToken");

      // ✅ axios.post નો સુધારેલો ઉપયોગ: ડેટા અને કન્ફિગ અલગ આર્ગ્યુમેન્ટ તરીકે
      const response = await axios.post<UserProfileData>(
        `http://localhost:8001/user/get/${id}`, // URL માં ID
        { roleName: roleName }, // ✅ POST વિનંતીની બોડી
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // ખાતરી કરો કે આ હેડર છે
          },
        }
      );
      console.log("API Response:", response.data);
      setProfileData(response.data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to load profile data.");
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const roleFromSession = sessionStorage.getItem("roleName");
    const idFromSession = sessionStorage.getItem("user_id");

    console.log("ProfilePage - Role from sessionStorage:", roleFromSession);
    console.log("ProfilePage - ID from sessionStorage (user_id):", idFromSession);

    setUserRole(roleFromSession);
    setCurrentUserId(idFromSession);

    if (roleFromSession && idFromSession) {
      fetchProfileData(idFromSession, roleFromSession);
    } else {
      setIsLoading(false);
      setError("User role or ID not found. Please log in.");
      // navigate('/login');
    }
  }, [fetchProfileData]);

  const handleViewProfileClick = () => {
    if (userRole) {
      navigate(`/${userRole}/view-profile`);
    } else {
      navigate('/login');
      console.warn("Role not found in sessionStorage. Cannot navigate to profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-40">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 flex items-center justify-center h-40">
        <p>{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-4 text-gray-500 flex items-center justify-center h-40">
        <p>No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="w-12 h-12 cursor-pointer">
            {profileData.avatarImage ? (
              <AvatarImage src={profileData.avatarImage} alt={`${profileData.firstName}'s avatar`} />
            ) : (
              <AvatarFallback className="bg-gray-200">
                <User className="w-8 h-8 text-gray-500" />
              </AvatarFallback>
            )}
          </Avatar>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4">
          <h3
            className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600" // mb-2 reduced margin
            onClick={handleViewProfileClick}
          >
            View Profile
          </h3>
          {/* Email ફક્ત અહીંયા PopoverContent માં બતાવો */}
          {profileData.email && (
            <p className="text-gray-700 text-sm mb-4">Email: {profileData.email}</p> // Added margin-bottom
          )}

          {/* બાકીનો પ્રોફાઇલ ડેટા જો તમે અહીંયા જ બતાવવા માંગતા હો તો ઉમેરો,
              નહીંતર તેને ફક્ત View Profile Page માં જ બતાવો. */}
          {/* ઉદાહરણ તરીકે:
          {profileData.firstName && profileData.lastName && (
            <p className="text-gray-700 text-sm">{profileData.firstName} {profileData.lastName}</p>
          )}
          {profileData.roleName && (
            <p className="text-gray-700 text-sm">Role: {profileData.roleName}</p>
          )}
          */}
        </PopoverContent>
      </Popover>

      {/* ❌ Card અને તેની અંદરનો ડેટા ડિસ્પ્લે કરતો કોડ અહીંથી દૂર કરવામાં આવ્યો છે */}
      {/*
      <Card className="mt-4 p-6 shadow-lg">
        <CardContent className="space-y-2">
          <p className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</p>
          <p className="text-gray-600 text-sm">{profileData.email}</p>
          {profileData.bio && (
            <p className="text-gray-700 text-sm">{profileData.bio}</p>
          )}
          {profileData._id && (
            <p className="text-gray-700 text-sm">User ID: {profileData._id}</p>
          )}
          {profileData.roleName && (
            <p className="text-gray-700 text-sm">Role: {profileData.roleName}</p>
          )}
          {userRole === "student" && profileData.studentId && (
            <p className="text-gray-700 text-sm">Student ID: {profileData.studentId}</p>
          )}
          {userRole === "student" && profileData.major && (
            <p className="text-gray-700 text-sm">Major: {profileData.major}</p>
          )}
          {userRole === "teacher" && profileData.employeeId && (
            <p className="text-gray-700 text-sm">Employee ID: {profileData.employeeId}</p>
          )}
          {userRole === "teacher" && profileData.department && (
            <p className="text-gray-700 text-sm">Department: {profileData.department}</p>
          )}
          {userRole === "teacher" && profileData.qualifications && (
            <p className="text-gray-700 text-sm">Qualifications: {profileData.qualifications}</p>
          )}
        </CardContent>
      </Card>
      */}
    </div>
  );
}