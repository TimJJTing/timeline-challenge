import { useTimelineStore } from "./store";
export const Segment = () => {
  const duration = useTimelineStore((state) => state.duration);

  return (
    <div
      className="py-2"
      style={{ width: `${duration}px` }}
      data-testid="segment"
    >
      <div className="h-6 rounded-md bg-white/10"></div>
    </div>
  );
};
