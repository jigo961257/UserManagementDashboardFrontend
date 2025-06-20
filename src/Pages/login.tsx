import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { signin, sendOtp, verifyOtp } from "@/api/login/action";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const resendSchema = z.object({
  email: z.string().email("Invalid email"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    register: resendRegister,
    handleSubmit: handleResendSubmit,
    formState: { errors: resendErrors, isSubmitting: otpSubmitting },
  } = useForm({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await signin(data);
      if (response?.status === true) {
        sessionStorage.setItem("accessToken", response?.data?.token);
        toast.success(response?.message);
        navigate("/dashboard");
      } else {
        toast.error(response?.response.data?.message);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleResendOtp = async (data: any) => {
    try {
      const response = await sendOtp(data);
      if (response?.status === true) {
        toast.success(response?.message);
        setShowOtp(true);
        setEmailForOtp(data.email);
      } else {
        toast.error(response?.response.data?.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      toast.error("Please enter a 4-digit OTP");
      return;
    }
    try {
      const response = await verifyOtp({ email: emailForOtp, otp: enteredOtp });
      if (response?.status === true) {
        toast.success(response?.message);
        setShowOtp(false);
        navigate("/dashboard");
        setOtp(["", "", "", ""]);
      } else {
        toast.error(response?.response.data?.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div


      style={{ fontFamily: "Poppins" ,backgroundImage: "url('/images/login.png')"}}
      className="min-h-screen flex items-center justify-center bg-red-500"
    >
      <Card className="w-full max-w-[500px] rounded-[22px] bg-[#FEFDF9] border-[0px] px-[46px] py-[114px] ">
        {/* <CardHeader>
          <CardTitle className="text-3xl text-center">Login</CardTitle>
        </CardHeader> */}
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="text-center space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Username or Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
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
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              <div style={{ fontFamily: "Poppins" }} className="text-[14px] font-[400]">Forgot Password?</div>
            </div>

            <Button
              style={{ fontFamily: "Poppins" }}
              type="submit"
              className="w-full max-w-[318px]  border-0 rounded-[18px] text-white text-[12px] bg-[#FE6C01] hover:bg-[#FE6C01]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="text-center font-[700] text-[14px]">OR</div>
          <div className="mt-6  pt-4 space-y-3">
            {!showOtp && (
              <form
                onSubmit={handleResendSubmit(handleResendOtp)}
                className="text-center space-y-4"
              >
                <Input
                  placeholder="Enter email to send OTP"
                  {...resendRegister("email")}
                />
                {resendErrors.email && (
                  <p className="text-red-500 text-sm">
                    {resendErrors.email.message}
                  </p>
                )}
                <Button
                  style={{ fontFamily: "Poppins" }}
                  type="submit"
                  className="w-full max-w-[318px] border-0 rounded-[18px] text-white text-[12px] bg-[#FE6C01] hover:bg-[#FE6C01]"
                  disabled={otpSubmitting}
                >
                  {otpSubmitting ? "Sending OTP..." : "Request OTP"}
                </Button>
              </form>
            )}

            {showOtp && (
              <div className="mt-4 space-y-2">
                <p className="text-center text-gray-600">
                  Enter 4-digit OTP sent to <strong>{emailForOtp}</strong>
                </p>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg"
                      maxLength={1}
                      ref={(el) => (otpRefs.current[index] = el)}
                    />
                  ))}
                </div>
                <Button
                  onClick={handleVerifyOtp}
                  className="w-full max-w-[318px] mt-2 border-0 rounded-[18px] text-white text-[12px] bg-[#FE6C01] hover:bg-[#FE6C01]"
                >
                  Verify OTP
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
