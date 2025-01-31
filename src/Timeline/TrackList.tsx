import { useRef } from "react";
import { useSyncScrollStore } from "./hooks";

export const TrackList = () => {
  const trackListRef = useRef<HTMLDivElement>(null);
  const syncScroll = useSyncScrollStore(trackListRef, false, false, true, true);
  return (
    <div
      className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto"
      data-testid="track-list"
      ref={trackListRef}
      onScroll={syncScroll}
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
};
