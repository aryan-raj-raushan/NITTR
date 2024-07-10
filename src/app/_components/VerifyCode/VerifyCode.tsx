'use client' 
import { useState } from 'react';
import logo from "public/nitttrLogo.jpg";
import Image from 'next/image';
export default function VerifyCode({ phoneNumber,setStep }:any) {
  const [verificationCode, setVerificationCode] = useState('');
  const handleVerify = () => {
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-20 bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="NITTTR" className="h-24 w-24" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">Check your phone for a verification code</h2>
        <p className="text-center mb-4">Twilio Verify has sent the code to:</p>
        <p className="text-center font-semibold mb-6">{phoneNumber}</p>
        <input
          type="text"
          placeholder="Enter verification code"
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button
          onClick={handleVerify}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition"
        >
          Verify
        </button>
        <div className="text-center mt-4">
          <p className="text-gray-600">Resend code via SMS in 30</p>
          {/* <p className="mt-4">
            <a href="#" className="text-blue-500 hover:underline">Send code via voice call</a>
          </p> */}
          <p className="mt-2">
            <a href="#" className="text-blue-500 hover:underline" onClick={() => setStep(1)}>Verify with another phone number</a>
          </p>
        </div>
      </div>
    </div>
  );
}
