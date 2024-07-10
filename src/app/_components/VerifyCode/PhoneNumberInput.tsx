"use client";
import Image from "next/image";
import { useState } from "react";
import logo from "public/nitttrLogo.jpg";
import axios from "axios";
import { SendOtp } from "~/utils/url/authurl";
export default function PhoneNumberInput({ onNext }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendSMS = async () => {
    setLoading(true);
    try {
      const response = await axios.post(SendOtp, {
        number: phoneNumber,
      });
      onNext(phoneNumber);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex justify-center">
          <Image src={logo} className="h-24 w-24" alt={"NITTTR"} />
        </div>
        <h2 className="mb-4 text-center text-2xl font-semibold">
          We'll also need to verify your phone number
        </h2>
        {/* <p className="text-center mb-4"></p> */}
        <div className="mb-4">
          <label htmlFor="country" className="block text-gray-700">
            Country
          </label>
          <input
            type="text"
            id="country"
            className="mb-4 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value="+91 India"
            disabled
          />
        </div>
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            className="mb-4 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        {error && <div className="mb-4 text-center text-red-500">{error}</div>}
        <button
          onClick={handleSendSMS}
          className={`w-full rounded bg-blue-500 py-2 text-white transition hover:bg-blue-600 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send code via SMS"}
        </button>
        {/* <div className="text-center mt-4">
          <a href="#" className="text-blue-500 hover:underline">Send code via voice call</a>
        </div> */}
      </div>
    </div>
  );
}
