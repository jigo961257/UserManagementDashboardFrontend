import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// CORRECTED IMPORT PATH: Importing from userActions
import { getUserByProfileId } from '@/api/login/Users/action'; 

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  roles?: {
    name: string;
  } | null;
  status?: string;
  is_archived?: boolean;
  profile_id?: string; // Ensure this is also part of your User interface if you fetch it
}

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>(); 
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) { // Using userId (which is actually profileId from URL)
      const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedUser = await getUserByProfileId(userId); 
          setUser(fetchedUser);
        } catch (err: any) {
          console.error("Error fetching user details:", err);
          setError(err.message || "Failed to load user details.");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading user details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-4">User not found.</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-5">
      <h2 className="text-2xl font-bold mb-4">User Details: {user.first_name} {user.last_name}</h2>
      <div className="space-y-2">
        <p><strong>First Name:</strong> {user.first_name}</p>
        <p><strong>Last Name:</strong> {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> {user.status ?? "N/A"}</p>
      </div>
    </div>
  );
}
