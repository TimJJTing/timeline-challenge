import { render, screen, fireEvent, act } from "@testing-library/react";
import { Timeline } from "../Timeline";
import { useTimelineStore } from "../store";
const initialStoreState = useTimelineStore.getState();

// integration tests
describe("Track List Behavior", () => {
  const setupComponent = () => {
    render(<Timeline />);
    return {
      initTime: initialStoreState.time,
      initDuration: initialStoreState.duration,
      getTime: () => useTimelineStore.getState().time,
      getDuration: () => useTimelineStore.getState().duration,
      timeInput: screen.getByTestId("current-time-input") as HTMLInputElement,
      durationInput: screen.getByTestId("duration-input") as HTMLInputElement,
      playhead: screen.getByTestId("playhead") as HTMLDivElement,
      keyframeList: screen.getByTestId("keyframe-list") as HTMLDivElement,
      trackList: screen.getByTestId("track-list") as HTMLDivElement,
    };
  };

  afterEach(() => {
    // reset state
    act(() => {
      useTimelineStore.setState(initialStoreState, true);
    });
  });

  describe("Vertical scrolling of the Track List is synchronized with the Keyframe List", () => {
    it("scrolls the Keyframe List by 300px down if the Track List is scrolled by 300px down", async () => {
      const { trackList, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(trackList, { target: { scrollTop: 300 } });
      });
      expect(trackList.scrollTop).toEqual(300);
      expect(keyframeList.scrollTop).toEqual(300);
    });

    it("scrolls the Keyframe List by 300px down eventually if the Track List is scrolled by 300px down then 150px up", async () => {
      const { trackList, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(trackList, { target: { scrollTop: 300 } });
        fireEvent.scroll(trackList, { target: { scrollTop: 150 } });
      });
      expect(trackList.scrollTop).toEqual(150);
      expect(keyframeList.scrollTop).toEqual(150);
    });
  });
});
