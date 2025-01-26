// useScrollSync.ts
import { useState } from "react";

export const useScrollSync = () => {
  const [isScrolling, setIsScrolling] = useState(false);

  const syncScroll = (
    scrolledRef: React.RefObject<HTMLElement>,
    otherRef: React.RefObject<HTMLElement>,
    syncHorizontal: boolean = true,
    syncVertical: boolean = true
  ) => {
    if (!isScrolling && scrolledRef.current && otherRef.current) {
      setIsScrolling(true);
      if (syncHorizontal) {
        otherRef.current.scrollLeft = scrolledRef.current.scrollLeft;
      }
      if (syncVertical) {
        otherRef.current.scrollTop = scrolledRef.current.scrollTop;
      }
      setTimeout(() => setIsScrolling(false), 0);
    }
  };

  return { syncScroll };
};
