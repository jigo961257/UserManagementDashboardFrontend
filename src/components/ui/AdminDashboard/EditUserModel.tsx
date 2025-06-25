import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Corrected Label import - assuming Label is from your UI library, not 'recharts'
import { Label } from "recharts";
import { toast } from 'react-toastify';
import axios from 'axios'; // Import axios for API calls
import { Loader2 } from 'lucide-react'; // Import Loader2 for loading indicator

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  roles?: {
    name: string;
  } | null;
  status?: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null; // This will provide the ID of the user to fetch
  onSave: (updatedUser: User) => void;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onSave,
}: EditUserModalProps) {
  // State for the form data, initialized to null or empty
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // New loading state for the modal's data fetch
  const [error, setError] = useState<string | null>(null); // New error state for fetch errors
  const [isSaving, setIsSaving] = useState(false); // New loading state for the save button

  // Effect to fetch user data when the modal opens or user ID changes
  useEffect(() => {
    if (isOpen && user?.id) { // Only fetch if modal is open and user ID is available
      setLoading(true);
      setError(null);
      setFormData(null); // Clear previous form data

      const fetchUserData = async () => {
        const token = sessionStorage.getItem("accessToken");
        try {
          // Changed to axios.get and included user.id directly in the URL (path parameter)
          const response = await axios.get<{ data: User }>(
            `http://localhost:8001/user/get/${user.id}`, // URL with ID as path parameter
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.data && response.data.data) {
            setFormData(response.data.data); // Set the fetched data to form state
            toast.success("User data loaded successfully!");
          } else {
            setError("Failed to fetch user data.");
            toast.error("Failed to load user data.");
          }
        } catch (err: any) {
          console.error("Error fetching user data for modal:", err);
          setError(err.response?.data?.message || "Error fetching user data.");
          toast.error("Error fetching user data for edit.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else if (!isOpen) {
      // Reset states when modal closes
      setFormData(null);
      setLoading(false);
      setError(null);
      setIsSaving(false);
    }
  }, [isOpen, user?.id]); // Re-run when modal opens/closes or user ID changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSave = async () => {
    if (formData && user?.id) { // Ensure formData and user.id are available
      setIsSaving(true); // Set saving state
      setError(null); // Clear previous errors

      const token = sessionStorage.getItem("accessToken");
      try {
        // Updated URL to include user.id as a path parameter for the PUT request
        const response = await axios.put<{ status: boolean, message: string, data: User }>(
          `http://localhost:8001/user/update/${user.id}`, // URL with ID as path parameter
          formData, // Send the updated form data in the body
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === true) {
          toast.success("User updated successfully!");
          onSave(response.data.data); // Pass the updated user data back to parent
          onClose(); // Close the modal after successful save
        } else {
          setError(response.data.message || "Failed to update user.");
          toast.error(response.data.message || "Failed to update user.");
        }
      } catch (err: any) {
        console.error("Error updating user:", err);
        setError(err.response?.data?.message || "An error occurred while saving.");
        toast.error("An error occurred while saving user.");
      } finally {
        setIsSaving(false); // Reset saving state
      }
    }
  };

  // Do not render the modal content if it's not open or no user is provided initially
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[#FE6C01]" />
            <p className="ml-2 text-gray-600">Loading user data...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            <p>{error}</p>
            <Button variant="outline" onClick={onClose} className="mt-2">Close</Button>
          </div>
        ) : formData ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              {/* You can add more fields here like roles if they are editable */}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          // This case should ideally not be reached if isOpen and user?.id is true
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500">No user data to display.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
