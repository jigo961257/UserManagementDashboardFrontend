import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API થી મળતા ડેટાના આધારે ઇન્ટરફેસ વ્યાખ્યાયિત કરો
interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarImage?: string;
  studentId?: string; // જો Student role માટે studentId હોય
  currennt_class?:string,
  major?: string;
  employeeId?: string;
  department?: string;
  qualifications?: string;
  _id?: string; // MongoDB ની _id પ્રોપર્ટી
  id?: number; // જો API response માં 'id' નંબર તરીકે હોય (તમારા કન્સોલ લોગ મુજબ)
  roleName?: string; // જેમ કે "Student", "Teacher", "Admin"
  role_id?:number,
  mothername?:string;
  fathername?:string;
  // અન્ય કોઈ પણ ફીલ્ડ્સ જે બેકએન્ડ મોકલે છે તે અહીં ઉમેરો
}

const ViewProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  console.log("Current profileData state:", profileData); // ડીબગિંગ માટે

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API માંથી પ્રોફાઇલ ડેટા ફેચ કરવાનું ફંક્શન
  const fetchProfileData = useCallback(async (id: string, roleName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("accessToken");

      const response = await axios.post<UserProfileData>(
        `http://localhost:8001/user/get/${id}`,
        { "roleName": roleName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("ViewProfile - API Response data:", response.data.data);
      setProfileData(response.data.data);

    } catch (err) {
      console.error("Error fetching profile data in ViewProfile:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
        navigate('/login');
      } else {
        setError("Failed to load profile data.");
      }
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const roleFromSession = sessionStorage.getItem("roleName");
    const idFromSession = sessionStorage.getItem("user_id");

    console.log("ViewProfile - Role from sessionStorage:", roleFromSession);
    console.log("ViewProfile - ID from sessionStorage (user_id):", idFromSession);

    if (roleFromSession && idFromSession) {
      fetchProfileData(idFromSession, roleFromSession);
    } else {
      setIsLoading(false);
      setError("User role or ID not found. Please log in.");
      navigate('/login');
    }
  }, [fetchProfileData, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p>No profile data available to display.</p>
      </div>
    );
  }

  const currentRole = profileData.roleName;
  const roleName=sessionStorage.getItem("roleName")

  return (
    <div className="p-8 ">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{roleName} Profile</h2>

      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {/* First Name અને Last Name ને સૌથી ઉપર લાવ્યા છીએ */}
            {profileData.firstName && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">First Name:</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.firstName}</td>
              </tr>
            )}
            {profileData.lastName && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Last Name:</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.lastName}</td>
              </tr>
            )}

            {/* અવતાર ઇમેજ (પ્રોફાઇલ પિક્ચર) */}
            {profileData.avatarImage && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Profile Picture:</td>
                <td className="px-6 py-3 text-sm text-gray-900">
                  <img
                    src={profileData.avatarImage}
                    alt={`${profileData.firstName}'s avatar`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  />
                </td>
              </tr>
            )}

            {/* બાકીના સામાન્ય પ્રોફાઇલ ફીલ્ડ્સ */}
            {profileData.email && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Email:</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.email}</td>
              </tr>
            )}
            {profileData.role_id && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Role:</td>
                <td className="px-6 py-3 text-sm text-gray-900 capitalize">{profileData.roleName}</td>
              </tr>
            )}
            {/* {profileData.bio && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Bio:</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.bio}</td>
              </tr>
            )} */}
            {profileData._id && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Database ID (_id):</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData._id}</td>
              </tr>
            )}
            {profileData.id && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">User ID (from API):</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.id}</td>
              </tr>
            )}

            {/* રોલ-વિશિષ્ટ ફીલ્ડ્સ */}
            {currentRole === "Student" && profileData.studentId && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Student ID:</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.studentId}</td>
              </tr>
            )}
            {currentRole === "Student" && profileData.currennt_class && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Major:</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.currennt_class}</td>
              </tr>
            )}

            {currentRole === "Teacher" && profileData.employeeId && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Employee ID:</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.employeeId}</td>
              </tr>
            )}
            {currentRole === "Teacher" && profileData.department && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Department:</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.department}</td>
              </tr>
            )}
            {currentRole === "Teacher" && profileData.qualifications && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">Qualifications:</td>
                <td className="px-6 py-3 text-sm text-gray-900">{profileData.qualifications}</td>
              </tr>
            )}

            {currentRole === "Admin" && (
                <></>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewProfile;