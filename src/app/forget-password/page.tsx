"use client";
import { CiUser } from "react-icons/ci";
import { TbPasswordFingerprint, TbPasswordUser } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import Spinner from "~/components/ui/spinner";
import { forgetLoginPassword } from "~/utils/url/authurl";
import { Bounce, toast } from "react-toastify";

interface FormData {
  email?: string;
  OTP?: number;
  password?: string;
  repeatPassword?: string;
}

const validationSchema = (step: number) => {
  switch (step) {
    case 1:
      return yup.object().shape({
        email: yup
          .string()
          .email("Invalid email")
          .required("Email is required"),
      });
    case 2:
      return yup.object().shape({
        OTP: yup
          .number()
          .typeError("OTP must be a number")
          .required("OTP is required"),
      });
    case 3:
      return yup.object().shape({
        password: yup
          .string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters")
          .matches(/[a-zA-Z]/, "Password must contain at least one letter")
          .matches(/[0-9]/, "Password must contain at least one number")
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character",
          ),
        repeatPassword: yup
          .string()
          .oneOf([yup.ref("password")], "Passwords must match")
          .required("Repeat Password is required"),
      });
    default:
      return yup.object().shape({});
  }
};

const ForgetPassword: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [visiblePass, setVisiblePass] = useState<{
    one: boolean;
    two: boolean;
  }>({
    one: false,
    two: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const visibleToast = (msg: string, code: number) => {
    if (code === 200) {
      toast.success(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      toast.error(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema(step)),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      if (step === 1) {
        const { code, msg } = await forgetLoginPassword({
          ref: "send_verification_code",
          email: data.email,
        });
        visibleToast(msg, code);
        if (code === 200) {
          setEmail(data.email!);
          setStep(2);
        }
      } else if (step === 2) {
        const { code, msg } = await forgetLoginPassword({
          ref: "verify_otp",
          email: email,
          otp: data.OTP,
        });
        visibleToast(msg, code);
        if (code === 200) setStep(3);
      } else if (step === 3) {
        const { code, msg } = await forgetLoginPassword({
          ref: "change_password",
          email: email,
          new_password: data.password,
        });
        if (code === 200) {
          setEmail("");
          router.push("/login");
          visibleToast(msg, code);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex h-[55vh] w-full items-center justify-center p-6"
      style={{ maxWidth: "90%" }} // Adjust form width for smaller screens
    >
      <div
        className="flex w-[100%] items-center justify-center border p-4 rounded-lg"
        style={{ flexDirection: "column", gap: "1.5rem", width: "100%" }}
      >
        {step === 1 && (
          <>
            <div className="w-full">
              <p className="mb-2">Enter your email address</p>
              <div className="w-full flex items-center border border-gray-300 rounded-md overflow-hidden">
                <div className="p-2">
                  <CiUser className="text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Username Or Email"
                  className="w-full text-base p-2 border-none"
                  {...register("email")}
                />
              </div>
              <p className="text-red-500 text-sm mt-1 px-2">
                {errors.email && errors.email.message}
              </p>
            </div>
            <button
              type="submit"
              className="py-2 px-6 bg-blue-600 text-white rounded-md font-medium w-full"
            >
              {isLoading ? <Spinner /> : "Continue"}
            </button>
            <p className="font-medium">
              Do you know the password?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Login
              </span>
            </p>
          </>
        )}
  
        {step === 2 && (
          <>
            <div className="w-full">
              <p className="mb-1">Enter OTP</p>
              <div className="w-full flex items-center border border-gray-300 rounded-md px-2">
                <TbPasswordFingerprint className="text-lg mr-2" />
                <input
                  type="number"
                  placeholder="****"
                  className="w-full text-base p-2 border-none"
                  {...register("OTP")}
                />
              </div>
              <p className="text-red-500 text-sm mt-1 px-2">
                {errors.OTP && errors.OTP.message}
              </p>
            </div>
            <button
              type="submit"
              className="py-2 px-6 bg-blue-600 text-white rounded-md font-medium w-full"
            >
              {isLoading ? <Spinner /> : "Continue"}
            </button>
          </>
        )}
  
        {step === 3 && (
          <>
            <div className="w-full">
              <p className="mb-1">New Password</p>
              <div className="w-full flex items-center border border-gray-300 rounded-md overflow-hidden">
                <div className="p-2">
                  <TbPasswordUser className="text-lg" />
                </div>
                <input
                  type={visiblePass.one ? "text" : "password"}
                  placeholder="****"
                  className="w-full text-base p-2 border-none"
                  {...register("password")}
                />
                <div
                  onClick={() =>
                    setVisiblePass({
                      ...visiblePass,
                      one: !visiblePass.one,
                    })
                  }
                  className="text-lg bg-gray-200 p-2 cursor-pointer"
                >
                  {visiblePass.one ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
              <p className="text-red-500 text-sm mt-1 px-2">
                {errors.password && "Repeat Password is required"}
              </p>
            </div>
            <div className="w-full">
              <p className="mb-1">Repeat Password</p>
              <div className="w-full flex items-center border border-gray-300 rounded-md overflow-hidden">
                <div className="p-2">
                  <TbPasswordUser className="text-lg" />
                </div>
                <input
                  type={visiblePass.two ? "text" : "password"}
                  placeholder="****"
                  className="w-full text-base p-2 border-none"
                  {...register("repeatPassword")}
                />
                <div
                  onClick={() =>
                    setVisiblePass({
                      ...visiblePass,
                      two: !visiblePass.two,
                    })
                  }
                  className="text-lg bg-gray-200 p-2 cursor-pointer"
                >
                  {visiblePass.two ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
              <p className="text-red-500 text-sm mt-1 px-2">
                {errors.repeatPassword && errors.repeatPassword.message}
              </p>
            </div>
            <button
              type="submit"
              className="py-2 px-6 bg-blue-600 text-white rounded-md font-medium w-full"
            >
              {isLoading ? <Spinner /> : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </form>
  );
  
};

export default ForgetPassword;
