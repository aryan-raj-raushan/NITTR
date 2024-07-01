import React, { useState } from "react";

const CustomInput = ({
  className,
  type = "number",
  min = 1,
  max = 30,
  guestLength,
  setGuestLength,
  onChange,
}: any) => {
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const value: any = parseInt(e.target.value, 10);

    if (value < min || value > max) {
      setValidationMessage(`Please select a number between ${min} and ${max}.`);
      setGuestLength(e.target.value);
    } else {
      setValidationMessage(null);
      setGuestLength(e.target.value);
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div>
      <input
        type={type}
        className={`flex h-10 w-full min-w-32 rounded-md border bg-background px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
        min={min}
        max={max}
        value={guestLength}
        onChange={handleChange}
        // {...props}
      />
     {validationMessage && (
        <p className="mt-1 text-sm text-red-600 absolute">{validationMessage}</p>
      )}
    </div>
  );
};

export { CustomInput };
