"use client";
import { useState } from "react";
import PhoneNumberInput from "./PhoneNumberInput";
import VerifyCode from "./VerifyCode";

export default function VerifyPhone({ email, id, name, role, token }: any) {
  const [phoneNumber, setPhoneNumber] = useState<number | undefined>();
  const [step, setStep] = useState(1);

  const handleNext = (phoneNumber: number) => {
    setPhoneNumber(phoneNumber);
    setStep(2);
  };

  return (
    <div>
      {step === 1 ? (
        <PhoneNumberInput onNext={handleNext} />
      ) : (
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
