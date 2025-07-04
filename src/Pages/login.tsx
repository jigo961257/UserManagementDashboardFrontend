import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
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
  const [otpError, setOtpError] = useState("");

  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  
  const [resendEmail, setResendEmail] = useState("");
 
  const {
    register,
    handleSubmit,
    watch,
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
defaultValues: { email: ""},
  });

 
const onSubmit = async (data: any) => {
  try {
  
    const payload = {
      ...data,
     
    };
   
    const response = await signin(payload);
    console.log("login data", response);

    if (response?.status === true) {
  const role = response?.data?.roleName; // lowercase for consistency
  sessionStorage.setItem("accessToken", response?.data?.token);
  sessionStorage.setItem("role_name", response?.data?.role_name);
sessionStorage.setItem("user_id", response?.data?.user_id);
  toast.success(response?.message);
  navigate(`/${role}/user-management`); // 👈 Dynamic route based on role
}
 else {
      toast.error(response?.response.data?.message);
    }
  } catch (err: any) {
    toast.error("server not connected");
    console.log(err);
  }
};

const handleResendOtp = async (data: any) => {
  try {
   
    const payload = {
      ...data,
    };

    console.log(payload);

    const response = await sendOtp(payload);
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
  setOtpError(""); // clear previous error

  if (enteredOtp.length !== 4) {
    setOtpError("Please enter a 4-digit OTP");
    return;
  }

  try {
    const response = await verifyOtp({ email: emailForOtp, otp: enteredOtp});

    if (response?.status === true) {
      sessionStorage.setItem("accessToken", response?.data?.token);
      sessionStorage.setItem("role_name", response?.data?.role_name);
      toast.success(response?.message);
      navigate(`/user-management`);
    } else {
      const errorMessage = response?.response?.data?.message || "Invalid OTP";
      setOtpError(errorMessage);
    }
  } catch (error: any) {
    setOtpError("An error occurred while verifying OTP");
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
 const disableLoginForm = !!resendEmail; // Disable login when resendEmail is typed
const disableOtpForm = !!watch("email") || !!watch("password") ; // Disable resend when login is filled

  return (
    <div


      style={{ fontFamily: "Poppins" ,backgroundImage: "url('/images/login.png')"}}
      className="min-h-screen flex items-center justify-center bg-red-500"
    >
      <Card className="w-full max-w-[500px] rounded-[22px] bg-[#FEFDF9] border-[0px] px-[46px] py-[114px] ">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Username or Email"
                  disabled={disableLoginForm}

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
                    disabled={disableLoginForm}

                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              <div style={{ fontFamily: "Poppins" }} className="text-[14px] font-[400] text-right mt-1">Forgot Password?</div>
            </div>

            <div>
 
  
</div>


            <Button
              style={{ fontFamily: "Poppins" }}
              type="submit"
              className="w-full border-0 rounded-[18px] text-white text-[12px] bg-[#FE6C01] hover:bg-[#FE6C01] cursor-pointer"
              disabled={isSubmitting ||  disableLoginForm
}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            
          </form>
          <div className="text-center font-[700] text-[14px]">OR</div>
          <div className="text-center mt-4 text-sm text-gray-600">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="text-[#FE6C01] font-semibold hover:underline"
  >
    Register here
  </Link>
</div>

          <div className="mt-2  pt-2 space-y-3">
            {!showOtp && (
              <form
                onSubmit={handleResendSubmit(handleResendOtp)}
                className=""
              >
                <Input
                  placeholder="Enter email to send OTP"
                  {...resendRegister("email")}
                    value={resendEmail}
  onChange={(e) => setResendEmail(e.target.value)}

                    disabled={!!watch("email") || !!watch("password") }

                />
                {resendErrors.email && (
                  <p className="text-red-500 text-sm">
                    {resendErrors.email.message}
                  </p>
                )}
                <Button
                  style={{ fontFamily: "Poppins" }}
                  type="submit"
                  className="w-full  border-0 rounded-[18px] text-white text-[12px] bg-[#FE6C01] hover:bg-[#FE6C01] mt-4 cursor-pointer"
                  disabled={otpSubmitting || disableOtpForm}
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
                      ref={(el) => { otpRefs.current[index] = el; }}
                    />
                  ))}
                </div>
                {otpError && (
  <p className="text-red-500 text-sm text-center">{otpError}</p>
)}

                <Button
                
                  onClick={handleVerifyOtp}
                  className="w-full mt-2 border-0 rounded-[18px] text-white text-[12px] bg-[#FE6C01] hover:bg-[#FE6C01] cursor-pointer"
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

