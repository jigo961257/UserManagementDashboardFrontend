import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Label } from "recharts"; // <-- આ લાઇન ખોટી છે, તેને દૂર કરો
import { Label } from "recharts"; // <-- આ લાઇન સાચી છે, આને વાપરો

import { signup } from "@/api/login/action"; // ખાતરી કરો કે આ પાથ સાચો છે
import { toast } from "react-toastify"; // ખાતરી કરો કે react-toastify ઇન્સ્ટોલ કરેલ છે અને ToastContainer સેટઅપ કરેલ છે
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    roleName: z.string().min(1, "Please select a roleName"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [submittedData, setSubmittedData] = useState<RegisterFormData | null>(null);
  console.log(submittedData); // આ ફક્ત ડીબગિંગ માટે છે, API કોલ પછી રીઅલ ડેટા આવશે

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // API કોલ અહીંયા!
      const response = await signup(data);
      console.log("API Response:", response); // API રિસ્પોન્સ લોગ કરો

      if (response?.status === true) {
        toast.success("Registration successful!");
        setSubmittedData(data); // જો સફળ થાય તો UI માં ડેટા બતાવો
        navigate("/login"); // સફળ રજીસ્ટ્રેશન પછી લોગિન પેજ પર રીડાયરેક્ટ કરો
      } else {
        // જો API માંથી ભૂલનો મેસેજ આવે તો તેને બતાવો, નહીંતર ડિફોલ્ટ મેસેજ
        toast.error(response?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div
      style={{ fontFamily: "Poppins", backgroundImage: "url('/images/login.png')" }}
      className="min-h-screen flex items-center justify-center bg-red-500"
    >
      <Card className="w-full max-w-[500px] rounded-[22px] bg-[#FEFDF9] px-[46px] py-[64px] border-0 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label value="first_name">First Name</Label>
              <Input id="first_name" {...register("first_name")} placeholder="First Name" />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <Label value="last_name">Last Name</Label>
              <Input id="last_name" {...register("last_name")} placeholder="Last Name" />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
              )}
            </div>

            <div>
              <Label value="email">Email</Label>
              <Input id="email" {...register("email")} type="email" placeholder="Email" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label value="password">Password</Label>
              <Input id="password" {...register("password")} type="password" placeholder="Password" />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label value="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div>
              <Label value="roleName">roleName</Label>
              <select
                id="roleName"
                {...register("roleName")}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                defaultValue=""
              >
                <option value="" disabled>Select roleName</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Admin">Admin</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option> {/* Techer ને Teacher માં સુધાર્યું */}
                <option value="Parent">Parent</option>
              </select>
              {errors.roleName && (
                <p className="text-red-500 text-sm mt-1">{errors.roleName.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-[#FE6C01] hover:bg-[#FE6C01]/90 text-white rounded-[18px] text-[14px]"
            >
              Register
            </Button>
          </form>

          {submittedData && (
            <div className="mt-6 text-green-600 text-sm text-center">
              ✅ Registered: {submittedData.first_name} {submittedData.last_name}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}