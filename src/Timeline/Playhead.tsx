import { useRef, useEffect, useState } from "react";
import { useTimelineStore, useScrollStore } from "./store";

interface PlayheadProps {
  keyframeListRef?: React.RefObject<HTMLDivElement>;
}

export const Playhead: React.FC<PlayheadProps> = ({ keyframeListRef }) => {
  const playheadRef = useRef<HTMLDivElement>(null);

  const time = useTimelineStore((state) => state.time);
  const scrollLeft = useScrollStore((state) => state.scrollLeft);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!playheadRef.current || !keyframeListRef?.current) return;

    const playheadRect = playheadRef.current.getBoundingClientRect();
    const keyframeListRect = keyframeListRef.current.getBoundingClientRect();

    // Check if playhead is horizontally within the keyframeList's bounds
    const isHorizontallyVisible =
      playheadRect.right > keyframeListRect.left &&
      playheadRect.left < keyframeListRect.right;

    setIsVisible(isHorizontallyVisible);
  }, [time, scrollLeft, keyframeListRef]);

  return (
    <div
      className="absolute h-full border-l-2 border-solid border-yellow-600 z-10 select-none"
      data-testid="playhead"
      style={{
        transform: `translateX(calc(${time}px - 50%))`,
        left: 316 - scrollLeft,
        visibility: isVisible ? "visible" : "hidden",
      }}
      ref={playheadRef}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
