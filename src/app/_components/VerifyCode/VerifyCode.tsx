"use client";
import { useRef, useState } from "react";
import logo from "public/nitttrLogo.jpg";
import Image from "next/image";
import { VerifyGooglePhone } from "~/utils/url/authurl";
import { Bounce, toast } from "react-toastify";
import { usePreviousRoute } from "~/hooks/usePreviousRoute";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "~/store";
import { setAuthState } from "~/store/authSlice";

export default function VerifyCode({
  phoneNumber,
  setStep,
  email,
  id,
  name,
  role,
  token,
}: any) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs: any = useRef([]);
  const previousRoute = usePreviousRoute();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleOtpChange = (e: any, index: number) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    try {
      const response = await fetch(VerifyGooglePhone, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, number: phoneNumber, otp: otpValue }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(
          setAuthState({
            authState: true,
            id: id,
            email: email,
            number: phoneNumber,
            role: role,
            name: name,
            authtoken: token,
          }),
        );

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

        if (previousRoute === "/login" || previousRoute === "/verify-phone") {
          router.push("/");
        } else {
          router.back();
        }
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
    <div className="flex min-h-full flex-col items-center justify-center bg-gray-100 p-4 py-20">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex justify-center">
          <Image src={logo} alt="NITTTR" className="h-24 w-24" />
        </div>
        <h2 className="mb-4 text-center text-xl font-semibold">
          Check your phone for a verification code
        </h2>
        <p className="mb-4 text-center">NITTTR has sent the code to:</p>
        <p className="mb-6 text-center font-semibold">{phoneNumber}</p>
        <div className="mb-4 mt-2 flex justify-between px-4">
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
        <button
          onClick={handleVerify}
          className="w-full rounded bg-blue-500 py-2 text-white transition hover:bg-blue-600"
        >
          Verify
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Resend code via SMS in 30</p>
          <p className="mt-2">
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={() => setStep(1)}
            >
              Verify with another phone number
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
