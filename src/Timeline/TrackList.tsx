import { forwardRef } from "react";

interface TrackListProps {
  onScroll?: () => void;
}

export const TrackList = forwardRef<HTMLDivElement, TrackListProps>(
  ({ onScroll }, ref) => {
    return (
      <div
        className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto"
        data-testid="track-list"
        ref={ref}
        onScroll={onScroll}
      >
        <div className="p-2">
          <div>Track A</div>
        </div>
        <div className="p-2">
          <div>Track B</div>
        </div>
        <div className="p-2">
          <div>Track C</div>
        </div>
        <div className="p-2">
          <div>Track D</div>
        </div>
        <div className="p-2">
          <div>Track E</div>
        </div>
        <div className="p-2">
          <div>Track F </div>
        </div>
        <div className="p-2">
          <div>Track G</div>
        </div>
        <div className="p-2">
          <div>Track H</div>
        </div>
        <div className="p-2">
          <div>Track I </div>
        </div>
        <div className="p-2">
          <div>Track J</div>
        </div>
      </div>
    );
  }
);
