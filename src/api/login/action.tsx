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
