import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'react-toastify';
// import { useNavigate } from "react-router-dom"; 
import { DataTable } from "../datatable";
import { getColumns } from "../columns"; 
import EditUserModal from "./EditUserModel";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import StatusConfirmationDialog from "@/components/ArchiveConfirmationDialog"; 
import { fetchAllUsers, deleteUser, updateUserStatus, fetchBulkUsers } from "@/api/login/Users/action";
import { Button } from "../button";
import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_archived?: boolean; 
  roles?: {
    name: string;
  } | null;
  status?: string; 
  profile_id?: string; 
}

interface BulkUser {
  id: string;
  first_name: string;
  last_name: string;
  email?: string; 
}

const TABS = ["users", "SuperAdmin", "Admin", "Teacher", "Student", "Parent","Bulk Users"];

export default function ShowUserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);


  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [userToToggleStatus, setUserToToggleStatus] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadCsvStatus, setUploadCsvStatus] = useState('');
  
    const bulkUserColumns: ColumnDef<User>[] = [
      {
        accessorKey: "first_name",
        header: "First Name",
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
      },
    ];


 const fetchDataForTable = async (role_name: string) => {
    setLoading(true);
    try {
      let fetchedUsers: User[] = [];

      if (role_name === "Bulk Users") {
        const bulkUsersData: BulkUser[] = await fetchBulkUsers(); 
        
        // Map the BulkUser data to your full User interface, providing defaults for missing fields
        // We ensure 'email' is included even if it's an empty string, to satisfy the User interface.
        fetchedUsers = bulkUsersData.map(bulkUser => ({
            id: bulkUser.id,
            first_name: bulkUser.first_name,
            last_name: bulkUser.last_name,
            email: bulkUser.email || '', // Provide email, even if empty, to match User interface
            is_archived: false,
            roles: null, 
            status: "Active", 
            profile_id: "", 
        })) as User[]; 

      } else {
        // fetchedUsers = await fetchAllUsers(role_name === "users" ? "" : role_name);
        const allUsers = await fetchAllUsers();
      if (role_name === "users") {
        fetchedUsers = allUsers;
      } else {
        fetchedUsers = allUsers.filter(user => user.roles?.name === role_name);
      }
    }
    setUsers(fetchedUsers);
      

      
    } catch (error) {
      // console.error("Error fetching users for table:", error);
      setUsers([]);
      toast.error("Failed to load users for " + role_name + ".");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataForTable(activeTab);
  }, [activeTab]);

  const handleEditClick = (user: User) => {
    setCurrentUserToEdit(user);
    setIsEditModalOpen(true);
  };

const handleSaveUser = () => {
     fetchDataForTable(activeTab);
    setIsEditModalOpen(true);
  };


  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        const message = await deleteUser(userToDelete.id);
        toast.success(message);
        fetchDataForTable(activeTab);
      }
      catch (error: any) {
        // console.error("Error deleting user:", error);
        toast.error(error.message || "An error occurred while deleting user.");
      } finally {
        setIsDeleteConfirmOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleToggleStatus = (user: User) => {
    setUserToToggleStatus(user);
    setIsStatusConfirmOpen(true);
  };

  const handleConfirmStatusToggle = async () => {
    if (userToToggleStatus) {
      const newStatus = userToToggleStatus.status === "Active" ? "Inactive" : "Active";
      try {
        await updateUserStatus(userToToggleStatus.id, newStatus);
        toast.success(`User ${userToToggleStatus.first_name} status updated to ${newStatus}!`);
        fetchDataForTable(activeTab); // Re-fetch data to reflect the change immediately
      } catch (error: any) {
        // console.error("Error updating user status:", error);
        toast.error(error.message || "An error occurred while updating status.");
      } finally {
        setIsStatusConfirmOpen(false); // Close the confirmation dialog
        setUserToToggleStatus(null); // Clear the user
      }
    }
  };

  const handleViewClick = (user: User) => { 
 
    if (user.profile_id) {
        const path = `/user-details/${user.profile_id}`;
        window.open(path, '_blank'); // Open the path in a new tab
    } else {
        toast.error("User profile ID is not available.");
    }
  };
 const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadCsvStatus(''); // Clear previous upload status when a new file is selected
    } else {
      setSelectedFile(null); // Clear selected file if nothing is chosen (e.g., user cancels dialog)
      setUploadCsvStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file first.");
      return;
    }

    setUploadCsvStatus('Uploading...');
    const formData = new FormData();
    formData.append("file", selectedFile); 

    try {
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL+"/user/upload-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      
      toast.success("CSV uploaded successfully!");
      setUploadCsvStatus("Upload successful!"); 

      if (activeTab === "Bulk Users") {
          fetchDataForTable("Bulk Users");
      }

    } catch (error: any) {
      let errorMessage = "Failed to upload CSV.";
      if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data?.message || errorMessage;
          toast.error(`CSV Upload Failed: ${errorMessage}`);
          setUploadCsvStatus(`Upload failed: ${errorMessage}`);
      } else {
          toast.error(`${errorMessage} Network error: ${error.message}`);
          setUploadCsvStatus(`${errorMessage} Network error: ${errorMessage}`); // Fix: Use errorMessage here
      }
    } finally {
        setSelectedFile(null); // Clear selected file after upload attempt
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    }
  };

  return (
    <div className="p-4">
     <div className="flex justify-between">
       <h2 className="text-2xl font-bold mb-4">User Management</h2>
   <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {/* "Select CSV File" button is always visible in the Bulk Users tab */}
            <Button
              className="bg-gray-600 hover:bg-gray-500 text-white"
              onClick={handleButtonClick}
            >
              Select CSV File
            </Button>
            
            {selectedFile && ( // Only show if a file is selected
              <Button
                className="bg-blue-400 hover:bg-blue-600"
                onClick={handleUpload}
                disabled={uploadCsvStatus === 'Uploading...'} // Disable during upload
              >
                {uploadCsvStatus === 'Uploading...' ? 'Uploading...' : 'Upload Selected CSV'}
              </Button>
            )}
          </div>
               </div>
      {activeTab === "Bulk Users" && (
               <>
                 {selectedFile && !uploadCsvStatus && (
                     <p className="mb-2 text-sm text-gray-700">Selected File: {selectedFile.name}</p>
                 )}
                 {uploadCsvStatus && (
                     <p className={`mb-4 ${uploadCsvStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                         {uploadCsvStatus}
                     </p>
                 )}
               </>
           )}
     
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
                   {loading && activeTab !== "Bulk Users" ? (
                     <p>Loading Data...</p>
                   ) : activeTab === "Bulk Users" ? (
                     users.length === 0 ? (
                         <p>No bulk-uploaded users found. Use the "Select CSV File" and "Upload Selected CSV" buttons above to add users.</p>
                     ) : (
                         <DataTable
                           columns={bulkUserColumns} 
                           data={users}
                           filterPlaceholder={`Filter bulk users...`}
                         />
                     )
                   ) : users.length === 0 ? (
                     <p>No users found for <strong>{activeTab}</strong>.</p>
                   ) : (
                     <DataTable
                       columns={getColumns({
                         onEdit: handleEditClick,
                         onDelete: handleDeleteClick,
                         onToggleStatus: handleToggleStatus,
                         onView: handleViewClick,
                       })}
                       data={users}
                       filterPlaceholder={`Filter ${activeTab} data...`}
                     />
                   )}
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

      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={userToDelete ? `${userToDelete.first_name} ${userToDelete.last_name}` : ''}
      />

      {/* Status Confirmation Dialog */}
      <StatusConfirmationDialog
        isOpen={isStatusConfirmOpen}
        onClose={() => {
          setIsStatusConfirmOpen(false);
          setUserToToggleStatus(null);
        }}
        onConfirm={handleConfirmStatusToggle}
        userName={userToToggleStatus ? `${userToToggleStatus.first_name} ${userToToggleStatus.last_name}` : ''}
        currentStatus={userToToggleStatus?.status ?? "N/A"}
      />

    </div>
  );
}
