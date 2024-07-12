'use client'
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const usePreviousRoute = () => {
  const pathname = usePathname();
  const previousRoute = useRef(pathname);

  useEffect(() => {
    const handleRouteChange = () => {
      previousRoute.current = pathname;
    };

    handleRouteChange();

  }, [pathname]);

  return previousRoute.current;
};
