import { useState, useEffect, useCallback } from 'react';
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
  mother_name?:string;
  father_name?:string;
  // અન્ય કોઈ પણ ફીલ્ડ્સ જે બેકએન્ડ મોકલે છે તે અહીં ઉમેરો
}

const ViewProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any | null>(null);
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
        import.meta.env.VITE_API_BASE_URL + `/user/get/${id}`,
        { "roleName": roleName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log("ViewProfile - API Response data:", response.data.data);
      // @ts-ignore
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

  // const currentRole = profileData.roleName;
  const roleName=sessionStorage.getItem("roleName")

  return (
    <div className="p-8 ">
      {/* <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {roleName} Profile
      </h2> */}

      {/* <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {profileData.first_name && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                  First Name:
                </td>
                <td className="px-6 py-3 text-sm text-gray-900">
                  {profileData.first_name}
                </td>
              </tr>
            )}
            {profileData.last_name && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                  Last Name:
                </td>
                <td className="px-6 py-3 text-sm text-gray-900">
                  {profileData.last_name}
                </td>
              </tr>
            )}

              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                  Profile Picture:
                </td>
                <td className="px-6 py-3 text-sm text-gray-900">
                  <img
                    src={profileData.avatarImage}
                    // alt={`${profileData.firstName}'s avatar`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  />
                </td>
              </tr>

            {profileData.email && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                  Email:
                </td>
                <td className="px-6 py-3 text-sm text-gray-900">
                  {profileData.email}
                </td>
              </tr>
            )}
            {roleName === "Student" && (
              <>
                <tr>
                  <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                    Father Name:
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {profileData.father_name ? profileData?.father_name : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                    Mother Name:
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {profileData.mother_name ? profileData?.mother_name : "-"}
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                    Current Class:
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {profileData.current_class
                      ? profileData?.current_class
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                    Current Entity:
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {profileData.current_entity
                      ? profileData.current_entity
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                    Current Section:
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {profileData.current_section
                      ? profileData.current_section
                      : "-"}
                  </td>
                </tr>
              </>
            )}
            {roleName === "Parent" && (
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                  Relation with Student:
                </td>
                <td className="px-6 py-3 text-sm text-gray-900">
                  {profileData.relationship_to_student
                    ? profileData.relationship_to_student
                    : "-"}
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div> */}
      <div className="p-8 flex flex-col items-center">
  <h2 className="text-3xl font-bold text-gray-800 mb-6">{roleName} Profile</h2>

  <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl text-center">
    {/* Profile Picture */}
    <div className="flex justify-center mb-4">
      <img
        src={profileData.avatarImage || "/default-avatar.png"} // fallback image if none
        // alt={`${profileData.first_name}'s avatar`}
        className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
      />
    </div>

    {/* Name and Email */}
    <h3 className="text-2xl font-semibold text-gray-900">{profileData.first_name} {profileData.last_name}</h3>
    <p className="text-gray-500 mb-6">{profileData.email}</p>

    {/* Profile Details Table */}
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-left">
        <tbody className="divide-y divide-gray-200">
          {/* Common Fields */}
          {profileData.father_name && (
            <tr>
              <td className="py-2 font-medium text-gray-700 w-1/3">Father Name:</td>
              <td className="py-2 text-gray-900">{profileData.father_name}</td>
            </tr>
          )}
          {profileData.mother_name && (
            <tr>
              <td className="py-2 font-medium text-gray-700 w-1/3">Mother Name:</td>
              <td className="py-2 text-gray-900">{profileData.mother_name}</td>
            </tr>
          )}
          {/* Student Fields */}
          {roleName === "Student" && (
            <>
              <tr>
                <td className="py-2 font-medium text-gray-700">Current Class:</td>
                <td className="py-2 text-gray-900">{profileData.current_class || "-"}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">Current Entity:</td>
                <td className="py-2 text-gray-900">{profileData.current_entity || "-"}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">Current Section:</td>
                <td className="py-2 text-gray-900">{profileData.current_section || "-"}</td>
              </tr>
            </>
          )}

          {/* Parent Fields */}
          {roleName === "Parent" && (
            <tr>
              <td className="py-2 font-medium text-gray-700">Relation with Student:</td>
              <td className="py-2 text-gray-900">{profileData.relationship_to_student || "-"}</td>
            </tr>
          )}

          {/* Teacher Fields */}
          {roleName === "Teacher" && (
            <>
              <tr>
                <td className="py-2 font-medium text-gray-700">Current Entity:</td>
                <td className="py-2 text-gray-900">{profileData.current_entity || "-"}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">Subject:</td>
                <td className="py-2 text-gray-900">{profileData.subject_taught || "-"}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

    </div>
  );
}

export default ViewProfile;