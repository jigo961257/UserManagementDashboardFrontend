import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import {
  signin,
  signup,
  DashboardData,
  sendOtp,
  verifyOtp,
  fetchAllUsers,
  updateUserStatus,
  deleteUser,
  getUserById,
  updateUser,
} from "@/api/login/action"; // adjust the import path

const mock = new AxiosMockAdapter(axios);

describe("API Service Tests", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should sign in user successfully", async () => {
    const mockData = { token: "12345" };
    mock.onPost("/auth/login").reply(200, mockData);

    const result = await signin({ email: "test@test.com", password: "123456" });
    expect(result).toEqual(mockData);
  });

  it("should register user successfully", async () => {
    const mockData = { status: true };
    mock.onPost("/auth/register").reply(200, mockData);

    const result = await signup({ email: "test@test.com", password: "123456" });
    expect(result).toEqual(mockData);
  });

  it("should fetch dashboard data", async () => {
    const mockData = { stats: { users: 10 } };
    mock.onGet("/dashboard/getall").reply(200, mockData);

    const result = await DashboardData();
    expect(result).toEqual(mockData);
  });

  it("should send OTP", async () => {
    const mockData = { status: true };
    mock.onPost("/auth/sendotp").reply(200, mockData);

    const result = await sendOtp({ email: "test@test.com" });
    expect(result).toEqual(mockData);
  });

  it("should verify OTP", async () => {
    const mockData = { verified: true };
    mock.onPost("/auth/verifyotp").reply(200, mockData);

    const result = await verifyOtp({ email: "test@test.com", otp: "123456" });
    expect(result).toEqual(mockData);
  });

  it("should fetch all users", async () => {
    const mockData = { data: [{ id: "1", first_name: "John", email: "john@test.com" }] };
    mock.onGet("/user/getall").reply(200, mockData);

    const result = await fetchAllUsers("SuperAdmin");
    expect(result).toEqual(mockData.data);
  });

  it("should update user status", async () => {
    const mockData = { status: true, data: { id: "1", status: "inactive" } };
    mock.onPost("/user/updatestatus/1").reply(200, mockData);

    const result = await updateUserStatus("1", "inactive");
    expect(result).toEqual(mockData.data);
  });

  it("should delete user", async () => {
    const mockData = { status: true, message: "Deleted" };
    mock.onDelete("/user/delete/1").reply(200, mockData);

    const result = await deleteUser("1");
    expect(result).toBe("Deleted");
  });

  it("should get user by ID", async () => {
    const mockData = { data: { id: "1", first_name: "John" } };
    mock.onGet("/user/getbyid/1").reply(200, mockData);

    const result = await getUserById("1");
    expect(result).toEqual(mockData.data);
  });

  it("should update user", async () => {
    const user = { id: "1", first_name: "John", last_name: "Doe", email: "john@test.com" };
    const mockData = { status: true, data: user };
    mock.onPut("/user/update/1").reply(200, mockData);

    const result = await updateUser(user);
    expect(result).toEqual(user);
  });
});
