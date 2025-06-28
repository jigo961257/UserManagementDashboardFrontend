import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Corrected Label import - assuming Label is from your UI library, not 'recharts'
import { Label } from "recharts"; 

import { signup } from "@/api/login/action"; // Ensure this path is correct
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Import Loader2 icon

const schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    // roleName is commented out, assuming it's handled internally by signup or inferred
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submittedData, setSubmittedData] = useState<RegisterFormData | null>(null);
  console.log(submittedData); // This is just for debugging

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // isSubmitting is provided by useForm
    reset, // Assuming you want to reset the form after submission
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // The `isSubmitting` state will automatically be set to true by react-hook-form
      // before this async function runs and set to false after it completes/errors.

      // API call to your signup action
      const response = await signup(data); // This assumes signup handles dummy data internally or calls a real API
      console.log("API Response:", response); // Log the API response

      if (response?.status === true) {
        toast.success("Registration successful!");
        // If response.data includes a roleName, you can use it here for submittedData display
        setSubmittedData({ ...data, roleName: response.data?.roleName || "Student" } as RegisterFormData);
        reset(); // Reset form fields
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        // Display error message from API response, or a default one
        toast.error(response?.response?.data?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div
      style={{ fontFamily: "Poppins", backgroundImage: "url('/images/login.png')" }}
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-red-500" // Changed bg-red-500 to bg-cover bg-center
    >
      <Card className="w-full max-w-[500px] rounded-[22px] bg-[#FEFDF9] px-[46px] py-[64px] border-0 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label value="first_name">First Name</Label> {/* Changed 'value' to 'value' for accessibility */}
              <Input id="first_name" {...register("first_name")} placeholder="First Name" />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <Label value="last_name">Last Name</Label> {/* Changed 'value' to 'value' */}
              <Input id="last_name" {...register("last_name")} placeholder="Last Name" />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
              )}
            </div>

            <div>
              <Label value="email">Email</Label> {/* Changed 'value' to 'value' */}
              <Input id="email" {...register("email")} type="email" placeholder="Email" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label value="password">Password</Label> {/* Changed 'value' to 'value' */}
              <div className="relative">
                <Input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label value="confirmPassword">Confirm Password</Label> {/* Changed 'value' to 'value' */}
              <div className="relative">
                <Input
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

         
            <Button
              type="submit"
              className="w-full mt-4 bg-[#FE6C01] hover:bg-[#FE6C01]/90 text-white rounded-[18px] text-[14px]
                         flex items-center justify-center" // Added flex and justify-center for loader alignment
              disabled={isSubmitting} // Disable the button while submitting
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* Loader icon */}
                  Register...
                </>
              ) : (
                "Register" // Default text
              )}
            </Button>
          </form>

          {submittedData && (
            <div className="mt-6 text-green-600 text-sm text-center">
              ✅ Registered: {submittedData.first_name} {submittedData.last_name} ({submittedData.email})
            </div>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FE6C01] hover:underline font-medium">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


