import { useRef } from "react";
import { Segment } from "./Segment";
import { useSyncScrollStore } from "./hooks";

export const KeyframeList = () => {
  const keyframeListRef = useRef<HTMLDivElement>(null);
  const syncScroll = useSyncScrollStore(
    keyframeListRef,
    true,
    true,
    true,
    true
  );
  return (
    <div
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
      ref={keyframeListRef}
      onScroll={syncScroll}
    >
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
    </div>
  );
};
