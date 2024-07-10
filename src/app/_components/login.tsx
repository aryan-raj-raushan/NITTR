"use client";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SendOtp, signIn, SinginWithGoogle, VerifyPhone } from "~/utils/url/authurl";
import { setAuthState } from "~/store/authSlice";
import { useAppDispatch } from "~/store";
import { useEffect, useState } from "react";
import { FaGoogle, FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { SignupURL } from "~/utils/url/authurl";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";

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
        router.back();
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

  const sendOtp = async () => {
    const phoneNumber = signupForm.getValues("number");
    if (phoneNumber) {
      try {
        const response = await fetch(SendOtp, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: phoneNumber }),
        });
  
        if (response.ok) {
          setOtpSent(true);
        } else {
          const errorData = await response.json();
          console.error("Error sending OTP:", errorData);
          // Handle error
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // Handle error
      }
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
                number: userVerificationResponse.data.phoneNumber || '',
                role: userInfo.role,
                name: userInfo.name,
                authtoken: userInfoResponse.data.body.token,
              })
            );
  
            toast.success('You have successfully logged in!', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            });
  
            router.back();
          } else {
            router.push('/verify-phone');
          }
        } else {
          throw new Error('Failed to verify user from backend');
        }
      } catch (error) {
        console.error('Error during Google sign-in:', error);
        toast.error('Google sign-in failed', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      }
    },
    onError: () => {
      console.error('Google sign-in failed');
      toast.error('Google sign-in failed', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    },
  });
  

  return (
    <>
      <div className="my-10 flex min-h-full items-center justify-center">
        <div className="relative min-h-[480px] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
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
                    onClick={() => handleGoogleSignin()}
                    className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                  >
                    <FaGoogle />
                  </button>
                  <button
                    className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                    onClick={signInWithPhone}
                  >
                    <FaPhoneAlt />
                  </button>
                  <button
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
                  className="mt-2 w-full border-none bg-gray-200 p-2 text-sm outline-none"
                  {...signupForm.register("name")}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className=" w-full border-none bg-gray-200 p-2 text-sm outline-none"
                  {...signupForm.register("email")}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="mt-1 w-full border-none bg-gray-200 p-2 text-sm outline-none"
                  {...signupForm.register("number")}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="mt-1 w-full border-none bg-gray-200 p-2 text-sm outline-none"
                  {...signupForm.register("password")}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="mt-1 w-full border-none bg-gray-200 p-2 text-sm outline-none"
                  {...signupForm.register("confirmPassword")}
                />
                {!isOtp ? (
                  <button
                    type="submit"
                    className="mt-4 transform rounded-full bg-primaryBackground px-12 py-3 text-sm font-bold uppercase text-white transition-transform duration-150 active:scale-95"
                  >
                    Verify Email
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="mt-4 transform rounded-full bg-primaryBackground px-12 py-3 text-sm font-bold uppercase text-white transition-transform duration-150 active:scale-95"
                  >
                    Send OTP
                  </button>
                )}
                {isOtp && otpSent && (
                  <button
                    type="submit"
                    className="mt-4 transform rounded-full bg-primaryBackground px-12 py-3 text-sm font-bold uppercase text-white transition-transform duration-150 active:scale-95"
                  >
                    Verify OTP
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
                    onClick={() => handleGoogleSignin()}
                    className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                  >
                    <FaGoogle />
                  </button>
                  <button
                    onClick={signInWithPhone}
                    className="mx-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
                  >
                    <FaPhoneAlt />
                  </button>
                  <button
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
      </div>
    </>
  );
}
