import Image from "next/image";
import React from "react";
import logo from "public/nitttrLogo.jpg";
const Loader = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Image src={logo} alt="loader" width={100} height={100} className="m-4" />

        <div className="typing-indicator">
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          <div className="typing-shadow"></div>
          <div className="typing-shadow"></div>
          <div className="typing-shadow"></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
