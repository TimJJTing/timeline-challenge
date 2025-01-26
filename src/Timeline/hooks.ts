// useScrollSync.ts
import { useState, useCallback } from "react";

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

export const useScrollPosition = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(
    (
      scrolledRef: React.RefObject<HTMLElement>
    ) => {
      if (scrolledRef.current) {
        const scrollTop = scrolledRef.current.scrollTop;
        const scrollLeft = scrolledRef.current.scrollLeft;
        setPosition({
          top: scrollTop,
          left: scrollLeft,
        });
      }
    },
    []
  );

  return { position, updatePosition };
};
