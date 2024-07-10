'use client'
import { useState } from "react";
import PhoneNumberInput from "../_components/VerifyCode/PhoneNumberInput";
import VerifyCode from "../_components/VerifyCode/VerifyCode";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState(1);

  const handleNext = (phoneNumber: any) => {
    setPhoneNumber(phoneNumber);
    setStep(2);
  };

  return (
    <div>
      {step === 1 && <PhoneNumberInput onNext={handleNext} />}
      {step === 2 && <VerifyCode phoneNumber={phoneNumber} setStep={setStep} />}
    </div>
  );
}
