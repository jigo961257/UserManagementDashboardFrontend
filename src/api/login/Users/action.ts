import makeRequest from "@/config/axios_instance";

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

export const fetchAllUsers = async (): Promise<User[]> => {
          const token = sessionStorage.getItem("accessToken");

  try {
    const response = await makeRequest({
      endpoint: "/user/getall",
      method: "GET", 
      // isToken: true,
            // params: role_name ? { role_name } : {}, // Added params back as it was in a prior version's `fetchUsers`

       
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
    });
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error in fetchAllUsers:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId: string, newStatus: string): Promise<User> => {
  try {
    const response = await makeRequest({
      endpoint: `/user/updatestatus/${userId}`, // Path parameter for ID
      method: "POST", // Or PATCH, depending on your backend
      data: { status: newStatus }, // Send new status in the body
      isToken: true,
    });
    if (response?.status) { // Assuming makeRequest returns an object with a status property
      return response.data; // Assuming response.data directly contains the updated user
    } else {
      throw new Error(response?.message || "Failed to update user status.");
    }
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<string> => {
  try {
    const response = await makeRequest({
      endpoint: `/user/delete/${userId}`, // Path parameter for ID
      method: "DELETE",
      isToken: true,
    });
    if (response?.status) {
      return response.message || "User deleted successfully!";
    } else {
      throw new Error(response?.message || "Failed to delete user.");
    }
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await makeRequest({
      endpoint: `/user/get/${userId}`, // Path parameter for ID
      method: "GET",
      isToken: true,
    });
    if (response?.data) { // Assuming response.data directly contains the user object
      return response.data;
    } else {
      throw new Error(response?.message || "User not found or data malformed.");
    }
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw error;
  }
};

export const updateUser = async (userData: User): Promise<User> => {
  try {
    const response = await makeRequest({
      endpoint: `/user/update/${userData.id}`, // Path parameter for ID
      method: "PUT", // Or PATCH
      data: userData, // Send the full user object in the body
      isToken: true,
    });
    console.log(response);
    if (response?.status) {
      return response.data;
    } else {
      throw new Error(response?.message || "Failed to update user.");
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

export const getUserByProfileId = async (profileId: string): Promise<User> => {
  try {
    const response = await makeRequest({
      endpoint: `/user/get/profile/${profileId}`, // Assuming this is your backend endpoint
      method: "GET",
      isToken: true, // Assuming this endpoint requires an access token
    });
    console.log(response);
    if (response?.data.data) {
      return response.data.data;
    } else {
      throw new Error(response?.message || "User not found or data malformed.");
    }
  } catch (error) {
    console.error("Error in getUserByProfileId:", error);
    throw error;
  }
};
export const uploadCsvFile = async (formData: FormData): Promise<any> => {
  try {
    // makeRequest needs to be configured to send FormData correctly
    // It should NOT set 'Content-Type': 'application/json' for FormData
    const response = await makeRequest({
      endpoint: "/upload-csv", // Replace with your actual CSV upload endpoint
      method: "POST", // File uploads are typically POST
      data: formData,
      isToken: true, // Assuming this endpoint requires an access token
      // makeRequest should handle setting 'Content-Type': 'multipart/form-data' automatically
      // when a FormData object is provided as 'data'.
      // If makeRequest sets a default 'Content-Type', you might need to adjust it
      // to explicitly NOT set it for FormData or provide a special flag.
      // For axios, you typically don't set 'Content-Type' header for FormData.
    });
    if (response?.status) {
      return response.data;
    } else {
      throw new Error(response?.message || "Failed to upload CSV file.");
    }
  } catch (error) {
    console.error("Error in uploadCsvFile:", error);
    throw error;
  }
};


interface BulkUser {
  id: string;
  first_name: string;
  last_name: string;
 
}

export const fetchBulkUsers = async (): Promise<BulkUser[]> => {

  try {
    const response = await makeRequest({
      endpoint: "/user/getcsvdata",
      method: "GET", 
       
          headers: {
            'Content-Type': 'application/json',
          },
    });
    console.log(response)
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error in fetchAllUsers:", error);
    throw error;
  }
};