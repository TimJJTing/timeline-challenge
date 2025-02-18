import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { Timeline } from "../Timeline";
import { useTimelineStore } from "../store";
const initialStoreState = useTimelineStore.getState();

// integration tests
describe("Playhead Behavior", () => {
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
      ruler: screen.getByTestId("ruler") as HTMLDivElement,
      segments: screen.getAllByTestId("segment") as HTMLDivElement[],
    };
  };
  const simulateStepperClick = async (
    user: UserEvent,
    input: HTMLInputElement,
    increment: boolean
  ) => {
    // Simulate stepper button click by dispatching input event
    const newValue = increment
      ? Number(input.value) + Number(input.step)
      : Number(input.value) - Number(input.step);
    // Simulate clicking stepper
    await user.click(input);
    fireEvent.change(input, {
      target: { value: String(newValue) },
    });
  };
  afterEach(() => {
    // reset state
    act(() => {
      useTimelineStore.setState(initialStoreState, true);
    });
  });

  describe("Playhead maintains its relative position during horizontal scrolling", () => {
    it("moves the playhead by 300px left if the Keyframe List is scrolled by 300px right", async () => {
      const { playhead, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(keyframeList, { target: { scrollLeft: 300 } });
      });
      expect(keyframeList.scrollLeft).toEqual(300);
      await waitFor(() => {
        expect(playhead).toHaveStyle(`left: ${316 - 300}px`);
      });
    });

    it("moves the playhead by 2000px left if the Keyframe List is scrolled by 2000px right", async () => {
      const { playhead, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(keyframeList, { target: { scrollLeft: 2000 } });
      });
      expect(keyframeList.scrollLeft).toEqual(2000);
      await waitFor(() => {
        expect(playhead).toHaveStyle(`left: ${316 - 2000}px`);
      });
    });

    it("moves the playhead by 300px left if the Ruler is scrolled by 300px right", async () => {
      const { playhead, ruler } = setupComponent();

      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 300 } });
      });
      expect(ruler.scrollLeft).toEqual(300);
      await waitFor(() => {
        expect(playhead).toHaveStyle(`left: ${316 - 300}px`);
      });
    });

    it("moves the playhead by 2000px left if the Ruler is scrolled by 2000px right", async () => {
      const { playhead, ruler } = setupComponent();

      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 2000 } });
      });
      expect(ruler.scrollLeft).toEqual(2000);
      await waitFor(() => {
        expect(playhead).toHaveStyle(`left: ${316 - 2000}px`);
      });
    });
  });

  describe("Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling", () => {
    it("moves the playhead by 2000px left and then 1000px right if the Keyframe List is scrolled by 2000px right and the Ruler is then scrolled by 1000px left", async () => {
      const { playhead, keyframeList, ruler } = setupComponent();

      await act(async () => {
        fireEvent.scroll(keyframeList, { target: { scrollLeft: 2000 } });
      });

      expect(keyframeList.scrollLeft).toEqual(2000);
      await waitFor(() => {
        expect(playhead).toHaveStyle(`left: ${316 - 2000}px`);
      });

      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 1000 } });
      });
      expect(ruler.scrollLeft).toEqual(1000);
      await waitFor(() => {
        expect(playhead).toHaveStyle(`left: ${316 - 1000}px`);
      });
    });

    it("moves the playhead by 2000px left and then 2000px right if the Ruler is scrolled by 2000px right and the Keyframe List is scrolled by 2000px left", async () => {
      const { playhead, ruler, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 2000 } });
      });
      expect(ruler.scrollLeft).toEqual(2000);
      await waitFor(() => {
        expect(playhead).toHaveStyle(`left: ${316 - 2000}px`);
      });

      await act(async () => {
        fireEvent.scroll(keyframeList, { target: { scrollLeft: 0 } });
      });
      expect(keyframeList.scrollLeft).toEqual(0);
      await waitFor(() => {
        expect(playhead).toHaveStyle(`left: ${316}px`);
      });
    });
  });

  describe("Playhead is visible only when within the Timeline's visible area, using the hidden attribute when completely out of view", () => {
    it("hides the Playhead if the Ruler is scrolled by 17px right", async () => {
      const { playhead, ruler } = setupComponent();

      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 17 } });
      });
      await waitFor(() => {
        expect(playhead).toHaveStyle("visibility: hidden");
      });
    });

    it("hides the Playhead if the Keyframe List is scrolled by 17px right", async () => {
      const { playhead, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(keyframeList, { target: { scrollLeft: 17 } });
      });
      await waitFor(() => {
        expect(playhead).toHaveStyle("visibility: hidden");
      });
    });

    it("shows the Playhead if the ruler is scrolled by 17px right but time is 10ms", async () => {
      const { timeInput, playhead, keyframeList, ruler } = setupComponent();
      const user = userEvent.setup();
      const mockPlayheadRect = jest
        .spyOn(playhead, "getBoundingClientRect")
        .mockReturnValue({
          x: 308,
          y: 154,
          width: 2,
          height: 298,
          top: 154,
          right: 310,
          bottom: 452,
          left: 308,
          toJSON: () => ({}),
        });
      const mockKeyframeListRect = jest
        .spyOn(keyframeList, "getBoundingClientRect")
        .mockReturnValue({
          x: 300,
          y: 194,
          width: 1212,
          height: 258,
          top: 194,
          right: 1512,
          bottom: 452,
          left: 300,
          toJSON: () => ({}),
        });
      await user.type(timeInput, "10{enter}");
      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 17 } });
      });

      await waitFor(() => {
        expect(playhead).toHaveStyle("visibility: visible");
      });
      mockPlayheadRect.mockRestore();
      mockKeyframeListRect.mockRestore();
    });

    it("shows the Playhead if the ruler is scrolled by 17px right but time is 10ms, then hides it after pressing {arrowDown} on time input", async () => {
      const { timeInput, playhead, keyframeList, ruler } = setupComponent();
      const user = userEvent.setup();
      const mockPlayheadRect = jest
        .spyOn(playhead, "getBoundingClientRect")
        .mockReturnValue({
          x: 308,
          y: 154,
          width: 2,
          height: 298,
          top: 154,
          right: 310,
          bottom: 452,
          left: 308,
          toJSON: () => ({}),
        });
      const mockKeyframeListRect = jest
        .spyOn(keyframeList, "getBoundingClientRect")
        .mockReturnValue({
          x: 300,
          y: 194,
          width: 1212,
          height: 258,
          top: 194,
          right: 1512,
          bottom: 452,
          left: 300,
          toJSON: () => ({}),
        });
      await user.type(timeInput, "10{enter}");
      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 17 } });
      });
      
      await waitFor(() => {
        expect(playhead).toHaveStyle("visibility: visible");
      });
      mockPlayheadRect.mockRestore();
      mockKeyframeListRect.mockRestore();

      jest.spyOn(playhead, "getBoundingClientRect").mockReturnValue({
        x: 298,
        y: 154,
        width: 2,
        height: 298,
        top: 154,
        right: 300,
        bottom: 452,
        left: 298,
        toJSON: () => ({}),
      });
      jest.spyOn(keyframeList, "getBoundingClientRect").mockReturnValue({
        x: 300,
        y: 194,
        width: 1212,
        height: 258,
        top: 194,
        right: 1512,
        bottom: 452,
        left: 300,
        toJSON: () => ({}),
      });
      await user.type(timeInput, "{arrowDown}");

      await waitFor(() => {
        expect(playhead).toHaveStyle("visibility: hidden");
      });
      mockPlayheadRect.mockRestore();
      mockKeyframeListRect.mockRestore();
    });

    it("shows the Playhead if the ruler is scrolled by 17px right but time is 10ms, then hides it after clicking native stepper down", async () => {
      const { timeInput, playhead, keyframeList, ruler } = setupComponent();
      const user = userEvent.setup();
      const mockPlayheadRect = jest
      .spyOn(playhead, "getBoundingClientRect")
      .mockReturnValue({
        x: 308,
        y: 154,
        width: 2,
        height: 298,
        top: 154,
        right: 310,
        bottom: 452,
        left: 308,
        toJSON: () => ({}),
      });
    const mockKeyframeListRect = jest
      .spyOn(keyframeList, "getBoundingClientRect")
      .mockReturnValue({
        x: 300,
        y: 194,
        width: 1212,
        height: 258,
        top: 194,
        right: 1512,
        bottom: 452,
        left: 300,
        toJSON: () => ({}),
      });
      await user.type(timeInput, "10{enter}");
      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 17 } });
      });

      await waitFor(() => {
        expect(playhead).toHaveStyle("visibility: visible");
      });
      mockPlayheadRect.mockRestore();
      mockKeyframeListRect.mockRestore();

      jest.spyOn(playhead, "getBoundingClientRect").mockReturnValue({
        x: 298,
        y: 154,
        width: 2,
        height: 298,
        top: 154,
        right: 300,
        bottom: 452,
        left: 298,
        toJSON: () => ({}),
      });
      jest.spyOn(keyframeList, "getBoundingClientRect").mockReturnValue({
        x: 300,
        y: 194,
        width: 1212,
        height: 258,
        top: 194,
        right: 1512,
        bottom: 452,
        left: 300,
        toJSON: () => ({}),
      });
      await simulateStepperClick(user, timeInput, false);

      await waitFor(() => {
        expect(playhead).toHaveStyle("visibility: hidden");
      });
      mockPlayheadRect.mockRestore();
      mockKeyframeListRect.mockRestore();
    });
  });
});
