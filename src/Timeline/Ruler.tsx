import { useEffect, useState, useCallback, useRef } from "react";
import { useTimelineStore } from "./store";
import { useSyncScrollStore } from "./hooks";

export const Ruler = () => {
  const rulerBarRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const setTime = useTimelineStore((state) => state.setTime);
  const duration = useTimelineStore((state) => state.duration);
  const syncScroll = useSyncScrollStore(rulerRef, true, true, false, false);

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
      ref={rulerRef}
      onScroll={syncScroll}
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
};
