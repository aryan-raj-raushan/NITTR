"use client";
import { useState } from "react";
import PhoneNumberInput from "../_components/VerifyCode/PhoneNumberInput";
import VerifyCode from "../_components/VerifyCode/VerifyCode";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const role = searchParams.get("role");
  const token = searchParams.get("token");

  const handleNext = (phoneNumber: number) => {
    setPhoneNumber(phoneNumber);
    setStep(2);
  };

  return (
    <div>
      {step === 1 && <PhoneNumberInput onNext={handleNext} />}
      {step === 2 && (
        <VerifyCode
          phoneNumber={phoneNumber}
          setStep={setStep}
          email={email}
          id={id}
          name={name}
          role={role}
          token={token}
        />
      )}
    </div>
  );
}
