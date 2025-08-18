// hooks/useIsMobile.ts
import { useState, useEffect } from "react";

export const  useIsMobile = (breakpoint: number = 768) =>  {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    console.log("useEffect that adds the event listener");
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile };
}
