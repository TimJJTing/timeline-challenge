import { useRef } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import { useScrollSync, useScrollPosition } from "./hooks";

export const Timeline = () => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  const { syncScroll } = useScrollSync();
  const { position, updatePosition } = useScrollPosition();

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls />
      <Ruler
        ref={rulerRef}
        onScroll={() => {
          syncScroll(rulerRef, keyframeListRef, true, false);
          updatePosition(rulerRef);
        }}
      />
      <TrackList
        ref={trackListRef}
        onScroll={() => syncScroll(trackListRef, keyframeListRef, false, true)}
      />
      <KeyframeList
        ref={keyframeListRef}
        onScroll={() => {
          syncScroll(keyframeListRef, rulerRef, true, false);
          syncScroll(keyframeListRef, trackListRef, false, true);
          updatePosition(keyframeListRef);
        }}
      />
      <Playhead ref={playheadRef} leftOffset={position.left} />
    </div>
  );
};
