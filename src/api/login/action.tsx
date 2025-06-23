import makeRequest from "@/config/axios_instance";

export async function signin(data: any) {
  try {
    const response = await makeRequest({
      endpoint: "/auth/login",
      method: "POST",
      data,
      isToken: false,
    });
    return response?.data;
  } catch (error) {
    console.error("Error during sign-in:", error);
    
    return error  }
}

export async function DashboardData() {
  try {
    const response = await makeRequest({
      endpoint: "/dashboard/getall",
      method: "GET",
      isToken: false,
    });
    console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Error during sign-in:", error);
    
    return error  }
}

export async function sendOtp(data: any) {
  try {
    const response = await makeRequest({
      endpoint: "/auth/sendotp",
      method: "POST",
      data,
      isToken: false,
    });
    return response?.data;
  } catch (error) {
    console.error("Error during sign-in:", error);
    return error  }
}

export async function verifyOtp(data: any) {
  try {
    const response = await makeRequest({
      endpoint: "/auth/verifyotp",
      method: "POST",
      data,
      isToken: false,
    });
    return response?.data;
  } catch (error) {
    console.error("Error during sign-in:", error);
    return error  }
}


