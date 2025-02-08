import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import { useRef } from "react";

export const Timeline = () => {
  const keyframeListRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700 overflow-clip"
      data-testid="timeline"
    >
      <PlayControls />
      <Ruler />
      <TrackList />
      <KeyframeList ref={keyframeListRef} />
      <Playhead keyframeListRef={keyframeListRef} />
    </div>
  );
};
