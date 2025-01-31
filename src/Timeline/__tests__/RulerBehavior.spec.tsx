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
describe("Ruler Behavior", () => {
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
      ruler: screen.getByTestId("ruler") as HTMLDivElement,
      rulerBar: screen.getByTestId("ruler-bar") as HTMLDivElement,
      keyframeList: screen.getByTestId("keyframe-list") as HTMLDivElement,
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

  describe("Clicking or dragging on the Ruler updates the Current Time and Playhead position", () => {
    it("handles mouse click on x position 100px correctly", async () => {
      const { rulerBar, playhead, timeInput, getTime } = setupComponent();
      const user = userEvent.setup();

      await user.pointer({
        target: rulerBar,
        coords: { clientX: 100, clientY: 10 },
      });
      await user.click(rulerBar);
      expect(timeInput).toHaveValue(100);
      expect(getTime()).toEqual(100);
      expect(playhead).toHaveStyle("transform: translateX(calc(100px - 50%))");
    });

    it("handles mouse click on x position 2000px correctly", async () => {
      const { rulerBar, playhead, timeInput, getTime } = setupComponent();
      const user = userEvent.setup();

      await user.pointer({
        target: rulerBar,
        coords: { clientX: 2000, clientY: 10 },
      });
      await user.click(rulerBar);
      expect(timeInput).toHaveValue(2000);
      expect(getTime()).toEqual(2000);
      expect(playhead).toHaveStyle("transform: translateX(calc(2000px - 50%))");
    });

    it("handles mouse click on x position -10px correctly", async () => {
      const { rulerBar, playhead, timeInput, getTime, initTime } =
        setupComponent();
      const user = userEvent.setup();

      await user.pointer({
        target: rulerBar,
        coords: { clientX: -10, clientY: 10 },
      });
      await user.click(rulerBar);
      expect(timeInput).toHaveValue(initTime);
      expect(getTime()).toEqual(initTime);
      expect(playhead).toHaveStyle(
        `transform: translateX(calc(${initTime}px - 50%))`
      );
    });

    it("handles mouse down on x position 100px and up on x position 200px correctly", async () => {
      const { rulerBar, playhead, timeInput, getTime } = setupComponent();
      const user = userEvent.setup();

      await user.pointer([
        { coords: { clientX: 100, clientY: 10 }, target: rulerBar },
        { keys: "[MouseLeft>]", target: rulerBar },
        { coords: { clientX: 200, clientY: 10 }, target: rulerBar },
        { keys: "[/MouseLeft]", target: rulerBar },
      ]);
      expect(timeInput).toHaveValue(200);
      expect(getTime()).toEqual(200);
      expect(playhead).toHaveStyle("transform: translateX(calc(200px - 50%))");
    });

    it("handles mouse down on x position 100px and up on x position 2010px correctly", async () => {
      const { rulerBar, playhead, timeInput, getTime } = setupComponent();
      const user = userEvent.setup();

      await user.pointer([
        { coords: { clientX: 100, clientY: 10 }, target: rulerBar },
        { keys: "[MouseLeft>]", target: rulerBar },
        { coords: { clientX: 2010, clientY: 10 }, target: rulerBar },
        { keys: "[/MouseLeft]", target: rulerBar },
      ]);
      expect(timeInput).toHaveValue(2000);
      expect(getTime()).toEqual(2000);
      expect(playhead).toHaveStyle("transform: translateX(calc(2000px - 50%))");
    });

    it("handles mouse down on x position 200px and up on x position 100px correctly", async () => {
      const { rulerBar, playhead, timeInput, getTime } = setupComponent();
      const user = userEvent.setup();

      await user.pointer([
        { coords: { clientX: 200, clientY: 10 }, target: rulerBar },
        { keys: "[MouseLeft>]", target: rulerBar },
        { coords: { clientX: 100, clientY: 10 }, target: rulerBar },
        { keys: "[/MouseLeft]", target: rulerBar },
      ]);
      expect(timeInput).toHaveValue(100);
      expect(getTime()).toEqual(100);
      expect(playhead).toHaveStyle("transform: translateX(calc(100px - 50%))");
    });

    it("handles mouse down on x position 200px and up on x position -100px correctly", async () => {
      const { rulerBar, playhead, timeInput, getTime } = setupComponent();
      const user = userEvent.setup();

      await user.pointer([
        { coords: { clientX: 200, clientY: 10 }, target: rulerBar },
        { keys: "[MouseLeft>]", target: rulerBar },
        { coords: { clientX: -100, clientY: 10 }, target: rulerBar },
        { keys: "[/MouseLeft]", target: rulerBar },
      ]);
      expect(timeInput).toHaveValue(0);
      expect(getTime()).toEqual(0);
      expect(playhead).toHaveStyle("transform: translateX(calc(0px - 50%))");
    });
  });

  describe("Horizontal scrolling of the Ruler is synchronized with the Keyframe List", () => {
    it("scrolls the Keyframe List by 300px right if the Ruler is scrolled by 300px right", async () => {
      const { ruler, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 300 } });
      });
      expect(ruler.scrollLeft).toEqual(300);
      await waitFor(() => {
        expect(keyframeList.scrollLeft).toEqual(300);
      });
    });

    it("scrolls the Keyframe List by 300px right eventually if the Ruler is scrolled by 300px right then 150px left", async () => {
      const { ruler, keyframeList } = setupComponent();

      await act(async () => {
        fireEvent.scroll(ruler, { target: { scrollLeft: 300 } });
        fireEvent.scroll(ruler, { target: { scrollLeft: 150 } });
      });
      expect(ruler.scrollLeft).toEqual(150);
      await waitFor(() => {
        expect(keyframeList.scrollLeft).toEqual(150);
      });
    });
  });

  describe("Ruler length visually represents the total Duration (1ms = 1px)", () => {
    it("has {initDuration}px when duration is {initDuration}", async () => {
      const { initDuration, rulerBar } = setupComponent();
      expect(rulerBar).toHaveStyle({ width: `${initDuration}px` });
    });

    it("has 3000px when duration is set to 3000", async () => {
      const { durationInput, rulerBar } = setupComponent();
      const user = userEvent.setup();

      await user.type(durationInput, "3000{enter}");
      expect(rulerBar).toHaveStyle({ width: "3000px" });
    });
  });

  describe("Ruler length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)", () => {
    it("is still {initDuration} when typing 3000, becomes 3000 after pressing {enter}", async () => {
      const { durationInput, initDuration, rulerBar } = setupComponent();
      const user = userEvent.setup();
      await user.click(durationInput);

      await user.keyboard("3000");
      expect(rulerBar).toHaveStyle({ width: `${initDuration}px` });
      await user.keyboard("{enter}");
      expect(rulerBar).toHaveStyle({ width: "3000px" });
    });

    it("is still {initDuration} when typing 3000, stays {initDuration} after pressing {escape}", async () => {
      const { durationInput, initDuration, rulerBar } = setupComponent();
      const user = userEvent.setup();

      await user.click(durationInput);
      await user.keyboard("3000");
      expect(rulerBar).toHaveStyle({ width: `${initDuration}px` });
      await user.keyboard("{escape}");
      expect(rulerBar).toHaveStyle({ width: `${initDuration}px` });
    });

    it("is still {initDuration} when typing 3000, becomes 3000 after loosing focus", async () => {
      const { durationInput, initDuration, rulerBar } = setupComponent();
      const user = userEvent.setup();

      await user.click(durationInput);
      await user.keyboard("3000");
      expect(rulerBar).toHaveStyle({ width: `${initDuration}px` });
      await user.keyboard("{tab}");
      expect(rulerBar).toHaveStyle({ width: "3000px" });
    });

    it("becomes {initDuration + step} after clicking on native step up", async () => {
      const { durationInput, initDuration, rulerBar } = setupComponent();
      const user = userEvent.setup();

      await simulateStepperClick(user, durationInput, true);
      expect(rulerBar).toHaveStyle({
        width: `${initDuration + Number(durationInput.step)}px`,
      });
    });

    it("becomes {initDuration - step} after clicking on native step down", async () => {
      const { durationInput, initDuration, rulerBar } = setupComponent();
      const user = userEvent.setup();

      await simulateStepperClick(user, durationInput, false);
      expect(rulerBar).toHaveStyle({
        width: `${initDuration - Number(durationInput.step)}px`,
      });
    });

    it("becomes {initDuration + step} after pressing on {arrowUp}", async () => {
      const { durationInput, initDuration, rulerBar } = setupComponent();
      const user = userEvent.setup();

      await user.type(durationInput, "{arrowUp}");
      expect(rulerBar).toHaveStyle({
        width: `${initDuration + Number(durationInput.step)}px`,
      });
    });

    it("becomes {initDuration - step} after pressing on {arrowDown}", async () => {
      const { durationInput, initDuration, rulerBar } = setupComponent();
      const user = userEvent.setup();

      await user.type(durationInput, "{arrowDown}");
      expect(rulerBar).toHaveStyle({
        width: `${initDuration - Number(durationInput.step)}px`,
      });
    });
  });
});
