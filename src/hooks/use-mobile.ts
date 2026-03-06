import { useEffect, useState } from "react";

export const MOBILE_BREAKPOINT = 850;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set initial value
    checkIsMobile();

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = () => {
      checkIsMobile();
    };

    mql.addEventListener("change", onChange);

    // Cleanup
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return isMobile;
}
