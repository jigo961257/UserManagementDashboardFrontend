import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'react-toastify';

// Import DataTable
import { DataTable } from "../datatable"; 
// Import getColumns (assuming it's in src/components/columns.tsx based on your provided code)
import { getColumns } from "../columns"; // Adjust this path if necessary

// Import modals
import EditUserModal from "./EditUserModel";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog"; // Ensure path is correct

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_archived?: boolean;
  roles?: {
    name: string;
  } | null;
  status?: string;
}

const TABS = ["users", "SuperAdmin", "Admin", "Teacher", "Student", "Parent"];

export default function ShowUserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null);

  // States for controlling the delete confirmation dialog
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async (role_name: string) => {
    setLoading(true);
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await axios.get<{ data: User[] }>(
        `http://localhost:8001/user/getall`,
        // { "role_name": role_name === "users" ? "" : role_name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("API Response (fetchUsers):", response.data);

      const userArray = response?.data?.data;
      if (Array.isArray(userArray)) {
        setUsers(userArray);
      } else {
        console.error("Expected array but got:", userArray);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(activeTab);
  }, [activeTab]);

  const handleEditClick = (user: User) => {
    setCurrentUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    console.log("User saved via modal:", updatedUser);
    fetchUsers(activeTab); // Re-fetch users for the current active tab
    setIsEditModalOpen(false);
    toast.success("User updated successfully! (Table refreshed)");
  };

  // Handler for opening the delete confirmation dialog
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  // Handler for confirming the delete action with API call
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const token = sessionStorage.getItem("accessToken");
      try {
        // Make the API call to delete the user by ID
        const response = await axios.delete<{ status: boolean, message: string }>(
          `http://localhost:8001/user/delete/${userToDelete.id}`, // API endpoint with ID as path parameter
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === true) {
          toast.success(`User ${userToDelete.first_name} ${userToDelete.last_name} deleted successfully!`);
          fetchUsers(activeTab); // Re-fetch the list to show updated data
        } else {
          toast.error(response.data.message || "Failed to delete user.");
        }
      } catch (error: any) {
        console.error("Error deleting user:", error);
        toast.error(error.response?.data?.message || "An error occurred while deleting user.");
      } finally {
        setIsDeleteConfirmOpen(false); // Close the confirmation dialog
        setUserToDelete(null); // Clear the user to delete
      }
    }
  };
  
  // src/components/ui/AdminDashboard/ShowUserMnagement.tsx માંથી
const handleToggleStatus = async (user: User) => {
  // અહીં લોજીક છે જે active ને inactive અને inactive ને active માં બદલે છે
  const newStatus = user.status === "Active" ? "Inactive" : "Active";
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await axios.post<{ status: boolean, message: string, data: User }>(
      `http://localhost:8001/user/updatestatus/${user.id}`,
      { status: newStatus }, // નવું સ્ટેટસ બેકએન્ડને મોકલે છે
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === true) {
      toast.success(`User ${user.first_name} status updated to ${newStatus}!`);
      fetchUsers(activeTab); // ડેટાને ફરીથી ફેચ કરીને ટેબલને તાજું કરે છે
    } else {
      toast.error(response.data.message || "Failed to update user status.");
    }
  } catch (error: any) {
    console.error("Error updating user status:", error);
    toast.error(error.response?.data?.message || "An error occurred while updating status.");
  }
};

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      user.first_name.toLowerCase().includes(search) ||
      user.last_name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);

    if (activeTab === "users") {
      return matchesSearch;
    } else {
      return user.roles?.name?.toLowerCase() === activeTab.toLowerCase() && matchesSearch;
    }
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-end">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/3"
                />
              </div>

              
                <DataTable
                  columns={getColumns({
                    onEdit: handleEditClick,
                    onDelete: handleDeleteClick, // Pass handleDeleteClick to columns
                    onToggleStatus:handleToggleStatus,
                  })}
                  data={filteredUsers}
                  // filterPlaceholder="Filter emails..."
                />
             
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={currentUserToEdit}
        onSave={handleSaveUser}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={userToDelete ? `${userToDelete.first_name} ${userToDelete.last_name}` : ''}
      />
    </div>
  );
}
