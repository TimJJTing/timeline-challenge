import { forwardRef } from "react";
import { useTimelineStore } from "./store";

interface PlayheadProps {
  leftOffset?: number;
}
export const Playhead = forwardRef<HTMLDivElement, PlayheadProps>(
  ({ leftOffset = 0 }, ref) => {
    const time = useTimelineStore((state) => state.time);
    return (
      <div
        className="absolute h-full border-l-2 border-solid border-yellow-600 z-10 select-none"
        data-testid="playhead"
        style={{
          transform: `translateX(calc(${time}px - 50%))`,
          left: 316 - leftOffset,
          visibility: 16 - leftOffset + time < 0 ? "hidden" : "visible", // 1 rem padding buffer
        }}
        ref={ref}
      >
        <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
      </div>
    );
  }
);
