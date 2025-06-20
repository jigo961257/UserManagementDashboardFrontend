import makeRequest from "@/config/axios_instance";

export async function signin(data: any) {
  try {
    const response = await makeRequest({
      endpoint: "/user/login",
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
      endpoint: "/user/sendotp",
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
      endpoint: "/user/verifyotp",
      method: "POST",
      data,
      isToken: false,
    });
    return response?.data;
  } catch (error) {
    console.error("Error during sign-in:", error);
    return error  }
}


