import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { Timeline } from "../Timeline";
import { useTimelineStore } from "../store";
const initialStoreState = useTimelineStore.getState();

// integration tests
describe("Keyframe List Behavior", () => {
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

  describe("Vertical scrolling is synchronized with the Track List", () => {
    it("scrolls the Track List by 300px down if the Keyframe List is scrolled by 300px down", async () => {
      const { trackList, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(keyframeList, { target: { scrollTop: 300 } });
      });
      expect(keyframeList.scrollTop).toEqual(300);
      expect(trackList.scrollTop).toEqual(300);
    });

    it("scrolls the Track List by 150px down eventually if the Keyframe List is scrolled by 300px down then 150px up", async () => {
      const { trackList, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(keyframeList, { target: { scrollTop: 300 } });
        fireEvent.scroll(keyframeList, { target: { scrollTop: 150 } });
      });
      expect(keyframeList.scrollTop).toEqual(150);
      expect(trackList.scrollTop).toEqual(150);
    });
  });

  describe("Horizontal scrolling is synchronized with the Ruler", () => {
    it("scrolls the Ruler by 300px right if the Keyframe List is scrolled by 300px right", async () => {
      const { ruler, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(keyframeList, { target: { scrollLeft: 300 } });
      });
      expect(keyframeList.scrollLeft).toEqual(300);
      expect(ruler.scrollLeft).toEqual(300);
    });

    it("scrolls the Ruler by 150px right eventually if the Keyframe List is scrolled by 300px right then 150px left", async () => {
      const { ruler, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(keyframeList, { target: { scrollLeft: 300 } });
        fireEvent.scroll(keyframeList, { target: { scrollLeft: 150 } });
      });
      expect(keyframeList.scrollLeft).toEqual(150);
      expect(ruler.scrollLeft).toEqual(150);
    });
  });

  describe("Segment length visually represents the total Duration (1ms = 1px)", () => {
    it("has {initDuration}px when duration is {initDuration}", async () => {
      const { initDuration, segments } = setupComponent();
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({ width: `${initDuration}px` });
      });
    });

    it("has 3000px when duration is set to 3000", async () => {
      const { durationInput, segments } = setupComponent();
      const user = userEvent.setup();

      await user.type(durationInput, "3000{enter}");
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({ width: "3000px" });
      });
    });
  });

  describe("Segment length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)", () => {
    it("is still {initDuration} when typing 3000, becomes 3000 after pressing {enter}", async () => {
      const { durationInput, initDuration, segments } = setupComponent();
      const user = userEvent.setup();
      await user.click(durationInput);

      await user.keyboard("3000");
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({ width: `${initDuration}px` });
      });
      await user.keyboard("{enter}");
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({ width: "3000px" });
      });
    });

    it("is still {initDuration} when typing 3000, stays {initDuration} after pressing {escape}", async () => {
      const { durationInput, initDuration, segments } = setupComponent();
      const user = userEvent.setup();

      await user.click(durationInput);
      await user.keyboard("3000");
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({ width: `${initDuration}px` });
      });
      await user.keyboard("{escape}");
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({ width: `${initDuration}px` });
      });
    });

    it("is still {initDuration} when typing 3000, becomes 3000 after loosing focus", async () => {
      const { durationInput, initDuration, segments } = setupComponent();
      const user = userEvent.setup();

      await user.click(durationInput);
      await user.keyboard("3000");
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({ width: `${initDuration}px` });
      });
      await user.keyboard("{tab}");
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({ width: "3000px" });
      });
    });

    it("becomes {initDuration + step} after clicking on native step up", async () => {
      const { durationInput, initDuration, segments } = setupComponent();
      const user = userEvent.setup();

      await simulateStepperClick(user, durationInput, true);
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({
          width: `${initDuration + Number(durationInput.step)}px`,
        });
      });
    });

    it("becomes {initDuration - step} after clicking on native step down", async () => {
      const { durationInput, initDuration, segments } = setupComponent();
      const user = userEvent.setup();

      await simulateStepperClick(user, durationInput, false);
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({
          width: `${initDuration - Number(durationInput.step)}px`,
        });
      });
    });

    it("becomes {initDuration + step} after pressing on {arrowUp}", async () => {
      const { durationInput, initDuration, segments } = setupComponent();
      const user = userEvent.setup();

      await user.type(durationInput, "{arrowUp}");
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({
          width: `${initDuration + Number(durationInput.step)}px`,
        });
      });
    });

    it("becomes {initDuration - step} after pressing on {arrowDown}", async () => {
      const { durationInput, initDuration, segments } = setupComponent();
      const user = userEvent.setup();

      await user.type(durationInput, "{arrowDown}");
      segments.forEach((segment) => {
        expect(segment).toHaveStyle({
          width: `${initDuration - Number(durationInput.step)}px`,
        });
      });
    });
  });
});
