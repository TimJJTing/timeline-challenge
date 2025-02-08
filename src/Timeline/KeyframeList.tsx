import React from "react";
import { Segment } from "./Segment";
import { useSyncScrollStore } from "./hooks";

export const KeyframeList = React.forwardRef<HTMLDivElement>((_, ref) => {
  const syncScroll = useSyncScrollStore(
    ref as React.RefObject<HTMLDivElement>,
    true,
    true,
    true,
    true
  );
  return (
    <div
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
      ref={ref}
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
});
