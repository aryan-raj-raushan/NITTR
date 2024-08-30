"use client";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";

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
      }
    },
    onError: () => {
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

  return (
    <>
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
                    Share your details and begin your unforgettable stay with us
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
        <div className="flex flex-col items-center justify-center min-h-screen py-8">
          <div className="w-full max-w-md space-y-8 bg-white rounded-2xl drop-shadow-2xl p-6">
            <div className="text-center bg-gradient-to-tr from-gray-50 via-gray-50 to-gray-100 rounded-2xl pt-6 pb-2">
              <h2 className="text-3xl font-extrabold text-gray-900">
                {rightPanelActive ? "Sign In to Your Account" : "Create Your Account"}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {rightPanelActive ? "Or " : "Already have an account? "}
                <button
                  className="font-medium p-2 bg-gray-200 rounded-lg text-blue-600 hover:text-blue-800 transition-colors duration-300"
                  onClick={rightPanelActive ? handleSignUpClick : handleSignInClick}
                >
                  {rightPanelActive ? (
                    <>
                      Sign Up <MdOutlineArrowForwardIos className="inline ml-1" />
                    </>
                  ) : (
                    <>
                      <MdOutlineArrowBackIosNew className="inline mr-1" /> Sign In
                    </>
                  )}
                </button>
              </p>
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
            </div>
            <div className="bg-white py-8 px-4 shadow-2xl rounded-lg sm:px-10 border-t border-gray-300">
              {rightPanelActive ? (
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="rounded-md shadow-sm flex flex-col gap-4">
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        {...form.register("email")}
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        {...form.register("password")}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link
                        href="/forget-password"
                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={signupForm.handleSubmit(onSubmitSignup)}>
                  <div className="rounded-md shadow-sm flex flex-col gap-4">
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Full Name"
                        {...signupForm.register("name")}
                      />
                    </div>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        {...signupForm.register("email")}
                      />
                    </div>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-3 text-gray-400" />
                      <input
                        id="number"
                        type="text"
                        autoComplete="tel"
                        required
                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Phone Number"
                        {...signupForm.register("number")}
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        {...signupForm.register("password")}
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Confirm Password"
                        {...signupForm.register("confirmPassword")}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
              <div className="w-80 bg-white p-4 rounded-lg shadow-lg transform transition-transform duration-300">
                <h2 className="text-lg font-bold mb-4">Enter OTP</h2>
                <p className="text-sm text-gray-600">
                  Phone Number: {signupForm.getValues("number")}
                </p>
                <div className="flex justify-between mt-2">
                  {otp.map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      ref={(el) => (otpRefs.current[i] = el)}
                      onChange={(e) => handleOtpChange(e, i)}
                    />
                  ))}
                </div>
                <div className="text-center mt-4">
                  <span className="text-sm text-gray-600">
                    {counter > 0 ? (
                      `Resend OTP in ${counter}s`
                    ) : (
                      <button onClick={handleResendOtp} className="text-blue-600 hover:text-blue-800">
                        Resend OTP
                      </button>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleSubmitOtp}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
