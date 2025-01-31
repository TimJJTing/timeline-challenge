import { forwardRef, useRef, useEffect } from "react";
import { useTimelineStore } from "./store";

export const Playhead = forwardRef<HTMLDivElement>((_, ref) => {
  const time = useTimelineStore((state) => state.time);
  const scrollLeftRef = useRef(useTimelineStore.getState().scrollLeft);
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useTimelineStore.subscribe(
        (state) => (scrollLeftRef.current = state.scrollLeft)
      ),
    []
  );
  return (
    <div
      className="absolute h-full border-l-2 border-solid border-yellow-600 z-10 select-none"
      data-testid="playhead"
      style={{
        transform: `translateX(calc(${time}px - 50%))`,
        left: 316 - scrollLeftRef.current,
        visibility:
          16 - scrollLeftRef.current + time < 0 ? "hidden" : "visible", // 1 rem padding buffer
      }}
      ref={ref}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
});
