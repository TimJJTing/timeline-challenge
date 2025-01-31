// hooks.ts
import { useRef, useEffect, useCallback } from "react";
import { useScrollStore } from "./store";

/**
 * A helper hook for syncing the scrolling position of given ref element.
 * Can optionally push/pull only horizontal/vertical scrolling states.
 * @param scrolledRef - Reference to the HTML element to sync scrolling
 * @param pushHorizontalUpdate - Whether to push horizontal scroll updates to store (default: true)
 * @param pullHorizontalUpdate - Whether to pull horizontal scroll updates from store (default: true)
 * @param pushVerticalUpdate - Whether to push vertical scroll updates to store (default: true)
 * @param pullVerticalUpdate - Whether to pull vertical scroll updates from store (default: true)
 * @returns A callback function to be used as scroll event handler
 * @example
 * ```tsx
 * function SplitView() {
 *   const leftPanelRef = useRef<HTMLDivElement>(null);
 *   const rightPanelRef = useRef<HTMLDivElement>(null);
 *
 *   // Sync both panels vertically only
 *   const syncLeftScroll = useSyncScrollStore(leftPanelRef, false, false, true, true);
 *   const syncRightScroll = useSyncScrollStore(rightPanelRef, false, false, true, true);
 *
 *   return (
 *     <div className="split-view">
 *       <div
 *         ref={leftPanelRef}
 *         onScroll={syncLeftScroll}
 *         className="panel"
 *       >
 *       </div>
 *       <div
 *         ref={rightPanelRef}
 *         onScroll={syncRightScroll}
 *         className="panel"
 *       >
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export const useSyncScrollStore = (
  scrolledRef: React.RefObject<HTMLElement>,
  pushHorizontalUpdate: boolean = true,
  pullHorizontalUpdate: boolean = true,
  pushVerticalUpdate: boolean = true,
  pullVerticalUpdate: boolean = true
) => {
  const isScrollingRef = useRef(false);
  const frameIdRef = useRef<number>();
  const setScrollLeft = useScrollStore((state) => state.setScrollLeft);
  const setScrollTop = useScrollStore((state) => state.setScrollTop);
  const scrollLeft = useScrollStore((state) => state.scrollLeft);
  const scrollTop = useScrollStore((state) => state.scrollTop);

  // Pull effect with error boundary
  useEffect(() => {
    if (!isScrollingRef.current && scrolledRef.current) {
      try {
        if (pullHorizontalUpdate) {
          scrolledRef.current.scrollLeft = scrollLeft;
        }
        if (pullVerticalUpdate) {
          scrolledRef.current.scrollTop = scrollTop;
        }
      } catch (error) {
        console.error("Error updating scroll position:", error);
      }
    }
  }, [scrollLeft, scrollTop]);

  // Push callback with RAF
  const syncScroll = useCallback(() => {
    if (!isScrollingRef.current && scrolledRef.current) {
      isScrollingRef.current = true;

      // Cancel any pending frame
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      frameIdRef.current = requestAnimationFrame(() => {
        try {
          if (pushHorizontalUpdate) {
            setScrollLeft(scrolledRef.current!.scrollLeft);
          }
          if (pushVerticalUpdate) {
            setScrollTop(scrolledRef.current!.scrollTop);
          }
          isScrollingRef.current = false;
        } catch (error) {
          console.error("Error syncing scroll:", error);
          isScrollingRef.current = false;
        }
      });
    }
  }, [setScrollLeft, setScrollTop]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  return syncScroll;
};
