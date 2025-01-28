import { useEffect, useState, useCallback, useRef, forwardRef } from "react";
import { useTimelineStore } from "./store";

interface RulerProps {
  onScroll?: () => void;
}

export const Ruler = forwardRef<HTMLDivElement, RulerProps>(
  ({ onScroll }, ref) => {
    const setTime = useTimelineStore((state) => state.setTime);
    const duration = useTimelineStore((state) => state.duration);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const rulerBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !rulerBarRef.current) return;
        const rect = rulerBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        setTime(x);
      };

      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", () => setIsDragging(false));
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", () => setIsDragging(false));
      };
    }, [setTime, isDragging]);

    const handleRulerMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault(); // Prevent text selection
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        setTime(x);
        setIsDragging(true);
      },
      [setTime]
    );

    return (
      <div
        className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
        data-testid="ruler"
        ref={ref}
        onScroll={onScroll}
      >
        <div
          ref={rulerBarRef}
          className="h-6 rounded-md bg-white/25"
          style={{ width: `${duration}px` }}
          data-testid="ruler-bar"
          onMouseDown={handleRulerMouseDown}
        ></div>
      </div>
    );
  }
);
