import { useEffect, useState } from "react";

/** Mismo breakpoint que Tailwind `nav2` (desktop desde 1120px) */
export const MOBILE_NAV_MEDIA_QUERY = "(max-width: 1119px)";

export function useIsMobileNav(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_NAV_MEDIA_QUERY).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_MEDIA_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
