import React, { useMemo, useCallback } from "react";
import { useTimelineStore } from "./store";

export const Ruler = () => {
  // TODO: implement mousedown and mousemove to update time and Playhead position
  const setTime = useTimelineStore((state) => state.setTime);
  const duration = useTimelineStore((state) => state.duration);
  const invisibleImage = useMemo(() => {
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    return img;
  }, []);

  const handleRulerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setTime(x);
    },
    [setTime]
  );
  const handleRulerDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      // when drag ends, the last cursor position is (0,0), this is not what we want 
      if (e.screenX === 0 && e.screenY === 0) {
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setTime(x);
    },
    [setTime]
  );
  const handleRulerDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      // get rid of ghost image and little earth when drag starts
      e.dataTransfer.effectAllowed = "none";
      e.dataTransfer.setDragImage(invisibleImage, 0, 0);
    },
    []
  );

  return (
    <div
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
    >
      <div
        className="h-6 rounded-md bg-white/25"
        style={{ width: `${duration}px` }}
        data-testid="ruler-bar"
        onMouseDown={handleRulerClick}
        draggable
        onDragStart={handleRulerDragStart}
        onDrag={handleRulerDrag}
      ></div>
    </div>
  );
};
