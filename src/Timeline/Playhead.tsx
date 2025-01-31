import { useRef } from "react";
import { useTimelineStore, useScrollStore } from "./store";

export const Playhead = () => {
  const playheadRef = useRef<HTMLDivElement>(null);
  const time = useTimelineStore((state) => state.time);
  const scrollLeft = useScrollStore((state) => state.scrollLeft);
  return (
    <div
      className="absolute h-full border-l-2 border-solid border-yellow-600 z-10 select-none"
      data-testid="playhead"
      style={{
        transform: `translateX(calc(${time}px - 50%))`,
        left: 316 - scrollLeft,
        visibility: 16 - scrollLeft + time < 0 ? "hidden" : "visible", // 1 rem padding buffer
      }}
      ref={playheadRef}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
