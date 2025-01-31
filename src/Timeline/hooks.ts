// hooks.ts
import { useState } from "react";
import { useTimelineStore } from "./store";

/**
 * A helper hook for syncing the scrolling position of given ref element.
 * Can optionally enable/disable syncing only horizontal/vertical scrolling.  
 * Can optionally syncing two elements.
 */
export const useSyncScroll = () => {
  const setScrollLeft = useTimelineStore((state) => state.setScrollLeft);
  const setScrollTop = useTimelineStore((state) => state.setScrollTop);

  const [isScrolling, setIsScrolling] = useState(false);
  const syncScroll = (
    scrolledRef: React.RefObject<HTMLElement>,
    syncHorizontal: boolean = true,
    syncVertical: boolean = true,
    otherRef: React.RefObject<HTMLElement> | null = null
  ) => {
    if (!isScrolling && scrolledRef.current) {
      setIsScrolling(true);
      if (syncHorizontal) {
        setScrollLeft(scrolledRef.current.scrollLeft);
        if (otherRef?.current) {
          otherRef.current.scrollLeft = scrolledRef.current.scrollLeft;
        }
      }
      if (syncVertical) {
        setScrollTop(scrolledRef.current.scrollTop);
        if (otherRef?.current) {
          otherRef.current.scrollTop = scrolledRef.current.scrollTop;
        }
      }
      setTimeout(() => setIsScrolling(false), 0);
    }
  };
  return { syncScroll };
};
