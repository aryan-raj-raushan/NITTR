"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const usePreventPreviousRoute = () => {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = (event: any) => {
      event.preventDefault();
      alert("You cannot go back to the previous page.");
      router.push("/");
    };

    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue = "";
      alert("You cannot refresh the page.");
      router.push("/");
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);
};

export default usePreventPreviousRoute;
