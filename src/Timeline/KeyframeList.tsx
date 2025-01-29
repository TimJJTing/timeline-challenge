import { forwardRef } from "react";
import { Segment } from "./Segment";

interface KeyframeListProps {
  onScroll?: () => void;
}

export const KeyframeList = forwardRef<HTMLDivElement, KeyframeListProps>(
  ({ onScroll }, ref) => {
    return (
      <div
        className="px-4 min-w-0 overflow-auto"
        data-testid="keyframe-list"
        ref={ref}
        onScroll={onScroll}
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
  }
);
