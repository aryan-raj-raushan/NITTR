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
      style={{ width: "40%" }}
      className="mx-auto flex h-[55vh] w-full items-center justify-center p-6"
    >
      <div
        className="flex w-full items-center justify-center border p-4 rounded-lg"
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {step === 1 && (
          <>
            <div style={{ width: "100%" }} className="">
              <p style={{ marginBottom: "0.5rem" }}>Enter your email address</p>
              <div
                style={{
                  width: "100%",
                  border: "1px solid #E2E8F0",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "0.4rem" }}>
                  <CiUser
                    style={{ fontSize: "1.3rem", marginRight: "0.1rem" }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Username Or Email"
                  style={{
                    fontSize: "1rem",
                    width: "100%",
                    border: "none",
                    padding: "0.5rem 0.5rem",
                  }}
                  {...register("email")}
                />
              </div>
              <p className="text-red-500 text-sm mt-1 px-2">
                {errors.email && errors.email.message}
              </p>
            </div>
            <button
              type="submit"
              style={{
                padding: "0.5rem 2.5rem",
                backgroundColor: "#3182CE",
                color: "white",
                borderRadius: "0.375rem",
                fontWeight: "500",
              }}
            >
              {isLoading ? <Spinner /> : "Continue"}
            </button>
            <p style={{ fontWeight: "500" }}>
              Do you know the password?{" "}
              <span
                style={{ color: "#3182CE", cursor: "pointer" }}
                onClick={() => router.push("/login")}
              >
                Login
              </span>
            </p>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ width: "100%" }}>
              <p style={{ marginBottom: "0.25rem" }}>Enter OTP</p>
              <div
                style={{
                  width: "100%",
                  border: "1px solid #E2E8F0",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0rem 0.4rem",
                }}
              >
                <TbPasswordFingerprint
                  style={{ fontSize: "1.3rem", marginRight: "0.1rem" }}
                />
                <input
                  type="number"
                  placeholder="****"
                  style={{
                    fontSize: "1rem",
                    width: "100%",
                    border: "none",
                    padding: "0.5rem 0.5rem",
                  }}
                  {...register("OTP")}
                />
              </div>
              {errors.OTP && errors.OTP.message}
            </div>
            <button
              type="submit"
              style={{
                padding: "0.5rem 2.5rem",
                backgroundColor: "#3182CE",
                color: "white",
                borderRadius: "0.375rem",
                fontWeight: "500",
              }}
            >
              {isLoading ? <Spinner /> : "Continue"}
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ width: "100%" }}>
              <p style={{ marginBottom: "0.25rem" }}>New Password</p>
              <div
                style={{
                  width: "100%",
                  border: "1px solid #E2E8F0",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "0.5rem" }}>
                  <TbPasswordUser
                    style={{ fontSize: "1.3rem", marginRight: "0.1rem" }}
                  />
                </div>
                <input
                  type={visiblePass.one ? "text" : "password"}
                  placeholder="****"
                  style={{
                    fontSize: "1rem",
                    width: "100%",
                    border: "none",
                    padding: "0.4rem",
                  }}
                  {...register("password")}
                />
                <div
                  onClick={() =>
                    setVisiblePass({
                      ...visiblePass,
                      one: !visiblePass.one,
                    })
                  }
                  style={{
                    fontSize: "1.25rem",
                    backgroundColor: "#EDF2F7",
                    padding: "0.6rem",
                    cursor: "pointer",
                  }}
                >
                  {visiblePass.one ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
              {errors.password && "Repeat Password is required"}
            </div>
            <div style={{ width: "100%" }}>
              <p style={{ marginBottom: "0.25rem" }}>Repeat Password</p>
              <div
                style={{
                  width: "100%",
                  border: "1px solid #E2E8F0",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "0.5rem" }}>
                  <TbPasswordUser
                    style={{ fontSize: "1.3rem", marginRight: "0.1rem" }}
                  />
                </div>
                <input
                  type={visiblePass.two ? "text" : "password"}
                  placeholder="****"
                  style={{
                    fontSize: "1rem",
                    width: "100%",
                    border: "none",
                    padding: "0.4rem",
                  }}
                  {...register("repeatPassword")}
                />
                <div
                  onClick={() =>
                    setVisiblePass({
                      ...visiblePass,
                      two: !visiblePass.two,
                    })
                  }
                  style={{
                    fontSize: "1.25rem",
                    backgroundColor: "#EDF2F7",
                    padding: "0.6rem",
                    cursor: "pointer",
                  }}
                >
                  {visiblePass.two ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
              {errors.repeatPassword && errors.repeatPassword.message}
            </div>
            <button
              type="submit"
              style={{
                padding: "0.5rem 2.5rem",
                backgroundColor: "#3182CE",
                color: "white",
                borderRadius: "0.375rem",
                fontWeight: "500",
              }}
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
