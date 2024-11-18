"use client";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import {
  SendOtp,
  signIn,
  SinginWithGoogle,
  UserExistenceURL,
  VerifyOtpURL,
  VerifyPhone,
} from "~/utils/url/authurl";
import { setAuthState } from "~/store/authSlice";
import { useAppDispatch } from "~/store";
import { useEffect, useRef, useState } from "react";
import { FaGoogle, FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { SignupURL } from "~/utils/url/authurl";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";
import Image from "next/image";
import { VerifiedIcon } from "~/components/Assets";
import { usePreviousRoute } from "~/hooks/usePreviousRoute";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa6";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

const AuthCredentialsValidator = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters long.",
    }),
    email: z.string().email(),
    number: z.string(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      return ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "The passwords did not match",
      });
    }
  });

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Invalid Password",
  }),
});

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string | null>(null);
  const [rightPanelActive, setRightPanelActive] = useState(true);
  const [isOtp, setIsOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [counter, setCounter] = useState(30);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const previousRoute = usePreviousRoute();

  const otpRefs: any = useRef([]);

  const handleOtpChange = (e: any, index: number) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const signupForm = useForm<z.infer<typeof AuthCredentialsValidator>>({
    resolver: zodResolver(AuthCredentialsValidator),
    defaultValues: {
      name: "",
      email: "",
      number: "",
      password: "",
      confirmPassword: "",
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Login function
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await signIn(data);
      if (response.code === 200) {
        const user = response.body;
        dispatch(
          setAuthState({
            authState: true,
            id: user?.id,
            email: user?.email,
            number: user?.number,
            role: user?.role,
            name: user?.name,
            authtoken: user?.token,
          }),
        );

        toast(response?.data?.msg || "You have successfully logged in!", {
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
        if (previousRoute === "/login") {
          router.push("/");
        } else {
          router.back();
        }
      } else {
        toast.error(response?.data?.msg || "Login failed", {
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
    } catch (error: any) {
      console.log(error.msg, "error.msg");
      toast.error(error.msg || "Login failed", {
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
  }

  const signInWithEmail = () => setIsOtp(false);
  const signInWithPhone = () => setIsOtp(true);

  // Call this function after logging in or updating auth data

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("email");
      setEmail(storedEmail);
    }
  }, []);

  const onSubmitSignup = async (
    data: z.infer<typeof AuthCredentialsValidator>,
  ) => {
    try {
      const response = await fetch(SignupURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          number: data.number,
          password: data.password,
          role: "USER",
        }),
      });

      const responseData = await response.json();

      if (responseData.code === 200) {
        toast.success("Signup successful!", {
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
        router.push("/registration");
        if (typeof window !== "undefined") {
          sessionStorage.setItem("email", responseData.body.email);
        }
        setEmail(responseData.body.email);
      } else {
        toast.error(responseData.msg || "Signup failed", {
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
    } catch (error: any) {
      toast.error(error.message, {
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

  const handleSendOtp = () => {
    sendOtp();
  };

  const handleResendOtp = () => {
    setCounter(30);
    sendOtp();
  };

  useEffect(() => {
    let timer: any;
    if (otpSent && counter > 0) {
      timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, counter]);

  const sendOtp = async () => {
    const email = signupForm.getValues("email");
    const phoneNumber = signupForm.getValues("number");

    if (email && phoneNumber) {
      try {
        const checkResponse = await fetch(UserExistenceURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, number: phoneNumber }),
        });

        const checkData = await checkResponse.json();

        if (checkResponse.ok && !checkData.exists) {
          // User does not exist, send OTP
          const response = await fetch(SendOtp, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ number: phoneNumber }),
          });

          if (response.ok) {
            setOtpSent(true);
            setShowModal(true); // Only show modal when OTP is successfully sent
            toast.success("OTP sent successfully!", {
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
            const errorData = await response.json();
            toast.error(errorData.msg || "Failed to send OTP", {
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
        } else {
          // User already exists
          toast.error("Email or phone number already exists. Try logging in.", {
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
      } catch (error: any) {
        toast.error(error.message, {
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
    } else {
      toast.error("Please provide both email and phone number.", {
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

  const handleSignUpClick = () => {
    setRightPanelActive(false);
    setIsOtp(false);
  };

  const handleSignInClick = () => {
    setRightPanelActive(true);
    setIsOtp(false);
  };
  const { handleSubmit, setValue } = form;

  const setFormValues = (values: any) => {
    setValue("email", values?.email);
    setValue("password", values?.password);
  };
  //hi
  const handleGoogleSignin = useGoogleLogin({
    onSuccess: async (res) => {
      setLoading(true);
      try {
        const token = res.access_token;
        const userInfoResponse = await axios.post(SinginWithGoogle, {
          token,
        });

        if (userInfoResponse.data.body.isVerified) {
          const userInfo = userInfoResponse.data.body.user;
          const userVerificationResponse = await axios.post(VerifyPhone, {
            email: userInfo.email,
          });

          if (userVerificationResponse.data.isVerified) {
            dispatch(
              setAuthState({
                authState: true,
                id: userInfo.id,
                email: userInfo.email,
                number: userVerificationResponse.data.phoneNumber || "",
                role: userInfo.role,
                name: userInfo.name,
                authtoken: userInfoResponse.data.body.token,
              }),
            );

            toast.success("You have successfully logged in!", {
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

            router.back();
          } else {
            router.push(
              `/verify-phone?email=${encodeURIComponent(userInfo.email)}&id=${userInfo.id}&name=${encodeURIComponent(userInfo.name)}&role=${userInfo.role}&token=${userInfoResponse.data.body.token}`,
            );
          }
        } else {
          throw new Error("Failed to verify user from backend");
        }
      } catch (error) {
        console.error("Error during Google sign-in:", error);
        toast.error("Google sign-in failed", {
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
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setLoading(false);
      console.error("Google sign-in failed");
      toast.error("Google sign-in failed", {
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
    },
  });

  const handleSubmitOtp = async () => {
    const phoneNumber = signupForm.getValues("number");
    const otpValue = otp.join("");

    try {
      const response = await fetch(VerifyOtpURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: phoneNumber, otp: otpValue }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowModal(false);
        setIsPhoneVerified(true);
        toast.success("OTP verified successfully!", {
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
        toast.error(data.msg || "Incorrect OTP", {
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
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP", {
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

  const [isLogin, setIsLogin] = useState(true);
  const [usePhone, setUsePhone] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
          <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        </div>
      )}
      <div className="hidden md:block">
        <div className="relative my-10 flex min-h-full items-center justify-center">
          <div className="relative min-h-[480px] w-full max-w-7xl overflow-hidden rounded-lg bg-white shadow-lg">
            <div
              className={`duration-600 absolute inset-0 flex transform transition-transform ${rightPanelActive ? "translate-x-0" : "translate-x-1/2"}`}
            >
              <div
                className={`duration-600 flex h-full w-1/2 flex-col items-center justify-center px-8 py-3 transition-opacity ${rightPanelActive ? "pointer-events-none opacity-0" : "opacity-100"}`}
              >
                <form
                  onSubmit={signupForm.handleSubmit(onSubmitSignup)}
                  className="no-scrollbar w-full space-y-3 overflow-y-auto text-center"
                >
                  <h1 className="font-bold">Create Account</h1>
                  <div className="my-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleGoogleSignin()}
                      className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                    >
                      <FaGoogle />
                    </button>
                    <button
                      type="button"
                      className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                      onClick={signInWithPhone}
                    >
                      <FaPhoneAlt />
                    </button>
                    <button
                      type="button"
                      className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                      onClick={signInWithEmail}
                    >
                      <IoIosMail />
                    </button>
                  </div>
                  <span className="text-sm">
                    {isOtp
                      ? " or use your email for registration"
                      : " or use your phone for registration"}
                  </span>
                  <input
                    type="text"
                    placeholder="Name"
                    className="mt-2 w-full rounded border-none bg-gray-200 p-2 text-sm outline-none"
                    {...signupForm.register("name")}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className=" w-full rounded border-none bg-gray-200 p-2 text-sm outline-none"
                    {...signupForm.register("email")}
                  />
                  <div className="!relative">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="mt-1 w-full rounded border-none bg-gray-200 p-2 text-sm outline-none"
                      {...signupForm.register("number")}
                    />
                    {isPhoneVerified && (
                      <Image
                        src={VerifiedIcon}
                        width={500}
                        height={500}
                        className="!absolute right-0 top-1.5 z-50 h-8 w-8"
                        alt="Verified Icon"
                      />
                    )}
                  </div>

                  <input
                    type="password"
                    placeholder="Password"
                    className="mt-1 w-full rounded border-none bg-gray-200 p-2 text-sm outline-none"
                    {...signupForm.register("password")}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="mt-1 w-full rounded border-none bg-gray-200 p-2 text-sm outline-none"
                    {...signupForm.register("confirmPassword")}
                  />
                  {otpSent ? (
                    <button
                      type="submit"
                      className="mt-4 transform rounded-full bg-primaryBackground px-12 py-3 text-sm font-bold uppercase text-white transition-transform duration-150 active:scale-95"
                    >
                      Verify Email
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="mt-4 transform rounded-full bg-primaryBackground px-12 py-3 text-sm font-bold uppercase text-white transition-transform duration-150 active:scale-95"
                    >
                      Send OTP
                    </button>
                  )}
                </form>
              </div>

              {/* Sign in form */}
              <div
                className={`duration-600 flex h-full w-1/2 flex-col items-center justify-center p-8 transition-opacity ${rightPanelActive ? "-translate-x-full opacity-100" : "pointer-events-none opacity-0"}`}
              >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full space-y-4 text-center"
                >
                  <h1 className="font-bold">Sign In</h1>
                  <div className="my-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleGoogleSignin()}
                      className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                    >
                      <FaGoogle />
                    </button>
                    <button
                      type="button"
                      onClick={signInWithPhone}
                      className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                    >
                      <FaPhoneAlt />
                    </button>
                    <button
                      type="button"
                      onClick={signInWithEmail}
                      className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                    >
                      <IoIosMail className="text-2xl" />
                    </button>
                  </div>
                  <span className="text-sm">
                    {isOtp
                      ? "or use your account"
                      : "or use your phone for login"}
                  </span>
                  {!isOtp ? (
                    <input
                      type="email"
                      placeholder="Email"
                      onChange={(e) =>
                        setFormValues({
                          ...form.getValues(),
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded border-none bg-gray-200 p-2 text-sm outline-none"
                    />
                  ) : (
                    <input
                      type="number"
                      placeholder="Phone"
                      onChange={(e) =>
                        setFormValues({
                          ...form.getValues(),
                          phone: e.target.value,
                        })
                      }
                      className="w-full rounded border-none bg-gray-200 p-2 text-sm outline-none"
                    />
                  )}

                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) =>
                      setFormValues({
                        ...form.getValues(),
                        password: e.target.value,
                      })
                    }
                    className="w-full rounded border-none bg-gray-200 p-2 text-sm outline-none"
                  />
                  {!isOtp ? (
                    <Link
                      href="/forget-password"
                      className="-mt-2 inline-block w-full px-1 text-start text-sm"
                    >
                      Forgot password?
                    </Link>
                  ) : (
                    <div className="inline-block w-full px-2 text-start text-sm">
                      Login with otp
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      className="transform rounded-full bg-primaryBackground px-12 py-3 text-sm font-bold uppercase text-white transition-transform duration-150 active:scale-95"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div
              className={`duration-600 absolute left-1/2 top-0 z-10 h-full w-1/2 transform overflow-hidden transition-transform ${rightPanelActive ? "translate-x-0" : "-translate-x-full"}`}
            >
              <div className="flex h-full flex-col items-center justify-center bg-gradient-to-r from-blue-800 from-20% to-primaryBackground p-8 text-white">
                <div
                  className={`duration-600 absolute inset-y-0 left-0 flex w-full items-center justify-center transition-transform ${rightPanelActive ? "translate-x-full" : "translate-x-0"}`}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl font-bold">Welcome Back!</h1>
                    <p className="mt-4 w-4/5 text-base">
                      To keep connected with us please login with your personal
                      info
                    </p>
                    <button
                      className="mt-6 rounded-full border border-white bg-transparent px-12 py-3 text-sm font-bold uppercase"
                      onClick={handleSignInClick}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
                <div
                  className={`duration-600 absolute inset-y-0 right-0 flex w-full items-center justify-center transition-transform ${rightPanelActive ? "translate-x-0" : "translate-x-full"}`}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl font-bold">Join Us!</h1>
                    <p className="mt-4 w-[85%] text-base">
                      Share your details and begin your unforgettable stay with
                      us
                    </p>
                    <button
                      className="mt-6 rounded-full border border-white bg-transparent px-12 py-3 text-sm font-bold uppercase"
                      onClick={handleSignUpClick}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 !z-50 flex w-full items-center justify-center bg-black bg-opacity-50">
              <div className="w-80 rounded-md bg-white p-4">
                <h2 className="mb-4 text-lg font-bold">Enter OTP</h2>
                <p>Phone Number: {signupForm.getValues("number")}</p>
                <div className="mt-2 flex justify-between">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="h-10 w-10 rounded-md border text-center"
                      ref={(el) => (otpRefs.current[i] = el)}
                      onChange={(e) => handleOtpChange(e, i)}
                    />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <span>
                    {counter > 0 ? (
                      `Resend OTP in ${counter}s`
                    ) : (
                      <button onClick={handleResendOtp}>Resend OTP</button>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleSubmitOtp}
                  className="mt-4 w-full rounded-md bg-primaryBackground py-2 text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="block md:hidden">
        <div className="flex h-screen flex-col items-center justify-center bg-white">
          <div className="w-full max-w-md rounded-lg bg-white p-8 ">
            <h2 className="mb-4 text-start text-3xl font-semibold">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <p className="mb-4 text-start text-gray-500">
              {isLogin ? "Welcome back to the app" : "Create a new account"}
            </p>

            {/* Toggle buttons for Email and Phone Number in Login */}
            {isLogin && (
              <div className="mb-6 flex justify-start space-x-4">
                <button
                  onClick={() => setUsePhone(false)}
                  className={`rounded-lg px-2  py-2 ${!usePhone ? "text-blue-500 underline" : "text-gray-700"}`}
                >
                  Email
                </button>
                <button
                  onClick={() => setUsePhone(true)}
                  className={`rounded-lg px-2 py-2 ${usePhone ? "text-blue-500 underline" : "text-gray-700"}`}
                >
                  Phone Number
                </button>
              </div>
            )}

            <form
              onSubmit={
                isLogin
                  ? handleSubmit(onSubmit)
                  : signupForm.handleSubmit(onSubmitSignup)
              }
            >
              {/* Login Form */}
              {isLogin ? (
                <>
                  {usePhone ? (
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1234567890"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                        {...signupForm.register("number")}
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="hello@example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                        {...form.register("email")}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      {...form.register("password")}
                    />
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">
                        Keep me signed in
                      </span>
                    </label>
                    <a
                      href="/forget-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="mb-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  {/* Signup Form */}
                  <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      {...signupForm.register("name")}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      {...signupForm.register("number")}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Email Address</label>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      {...signupForm.register("email")}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      {...signupForm.register("password")}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Re-enter Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      {...signupForm.register("confirmPassword")}
                    />
                  </div>

                  <button
                    type="submit"
                    className="mb-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </form>

            {/* Switch between Login and Signup */}

            {/* Google Sign-in */}
            {isLogin && (
              <>
                <div className="my-4 text-center">or sign in with</div>
                <div className="text-center">
                  <button
                    className="w-full rounded-md border bg-gray-100 py-2 text-gray-700 hover:bg-gray-200"
                    onClick={() => handleGoogleSignin()}
                  >
                    <span className="flex items-center justify-center">
                      <FcGoogle size={24} className="mr-2" />
                      Continue with Google
                    </span>
                  </button>
                </div>
              </>
            )}
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline"
              >
                {isLogin
                  ? "Create an account"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>

        {/* OTP Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-xl font-semibold">Enter OTP</h3>
              <div className="mb-4 flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    className="h-12 w-12 rounded-md border border-gray-300 text-center"
                  />
                ))}
              </div>
              <button
                onClick={handleSubmitOtp}
                className="mb-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                Submit OTP
              </button>
              <p className="text-center text-gray-500">
                Resend OTP in {counter} seconds
              </p>
              <button
                onClick={handleResendOtp}
                className="mt-4 text-center text-blue-600 hover:underline"
                disabled={counter > 0}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
