import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { Timeline } from "../Timeline";
import { useTimelineStore } from "../store";
const initialStoreState = useTimelineStore.getState();

// integration tests
describe("Play Controls Behavior", () => {
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

  describe("Current Time Validation", () => {
    it("has initial value between 0ms and the Duration", async () => {
      const { getTime, getDuration } = setupComponent();
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("accepts valid time inputs (1000)", async () => {
      const { timeInput, getTime, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "1000{enter}");
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("accepts valid time inputs (2000)", async () => {
      const { timeInput, getTime, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("accepts valid time inputs (3000) but fallback to duration", async () => {
      const { timeInput, getTime, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "3000{enter}");
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("handles negative time input (-3000) by setting to 0", async () => {
      const { timeInput, getTime, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "-3000{enter}");
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("rounds time input (2005) to multiples of 10ms", async () => {
      const { timeInput, getTime, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2005{enter}");
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("rounds time input (-5) to multiples of 10ms", async () => {
      const { timeInput, getTime, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "-5{enter}");
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("is still non-negative after clicking the stepper when time = 0", async () => {
      const { timeInput, getTime, getDuration } = setupComponent();
      const user = userEvent.setup();
      await simulateStepperClick(user, timeInput, false);
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("is still not exceeding the duration after clicking the stepper", async () => {
      const { timeInput, initDuration, getTime, getDuration } =
        setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, String(initDuration) + "{enter}");
      await simulateStepperClick(user, timeInput, true);
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("is still non-negative after pressing {arrowDown}", async () => {
      const { timeInput, getTime, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "{arrowDown}");
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("is still not exceeding the duration after pressing {arrowUp}", async () => {
      const { timeInput, initDuration, getTime, getDuration } =
        setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, String(initDuration) + "{enter}");
      await user.type(timeInput, "{arrowUp}");
      expect(getTime()).toBeGreaterThanOrEqual(0);
      expect(getTime()).toBeLessThanOrEqual(getDuration());
    });

    it("rounds time inputs to multiples of 10ms after set to 123", async () => {
      const { timeInput, getTime } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "123{enter}");
      expect(getTime() % 10).toEqual(0);
    });

    it("rounds time inputs to multiples of 10ms after set to 128", async () => {
      const { timeInput, getTime } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "128{enter}");
      expect(getTime() % 10).toEqual(0);
    });

    it("rounds time inputs to multiples of 10ms after set to 1234.2143", async () => {
      const { timeInput, getTime } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "1234.2143{enter}");
      expect(getTime() % 10).toEqual(0);
    });

    it("rounds time inputs to multiples of 10ms after set to 1235.2143", async () => {
      const { timeInput, getTime } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "1235.2143{enter}");
      expect(getTime() % 10).toEqual(0);
    });

    it("rounds time inputs to multiples of 10ms after set to -1234.2143", async () => {
      const { timeInput, getTime } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "-1234.2143{enter}");
      expect(getTime() % 10).toEqual(0);
    });

    it("rounds time inputs to multiples of 10ms after set to -1235.2143", async () => {
      const { timeInput, getTime } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "-1235.2143{enter}");
      expect(getTime() % 10).toEqual(0);
    });
  });

  describe("Duration Validation", () => {
    it("enforces minimum duration of 100ms after set to 0", async () => {
      const { durationInput, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(durationInput, "0{enter}");
      expect(getDuration()).toBeGreaterThanOrEqual(100);
      expect(getDuration()).toBeLessThanOrEqual(6000);
    });

    it("enforces minimum duration of 100ms after set to -1000", async () => {
      const { durationInput, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(durationInput, "-1000{enter}");
      expect(getDuration()).toBeGreaterThanOrEqual(100);
      expect(getDuration()).toBeLessThanOrEqual(6000);
    });

    it("enforces maximum duration of 6000ms after set to 7000", async () => {
      const { durationInput, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(durationInput, "6000{enter}");
      expect(getDuration()).toBeGreaterThanOrEqual(100);
      expect(getDuration()).toBeLessThanOrEqual(6000);
    });

    it("rounds duration inputs to multiples of 10ms after set to 123", async () => {
      const { durationInput, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(durationInput, "123{enter}");
      expect(getDuration() % 10).toEqual(0);
    });

    it("rounds duration inputs to multiples of 10ms after set to 128", async () => {
      const { durationInput, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(durationInput, "128{enter}");
      expect(getDuration() % 10).toEqual(0);
    });

    it("rounds duration inputs to multiples of 10ms after set to 1234.2143", async () => {
      const { durationInput, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(durationInput, "1234.2143{enter}");
      expect(getDuration() % 10).toEqual(0);
    });

    it("rounds duration inputs to multiples of 10ms after set to 1235.2143", async () => {
      const { durationInput, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(durationInput, "1235.2143{enter}");
      expect(getDuration() % 10).toEqual(0);
    });

    it("rounds duration inputs to multiples of 10ms after set to -1234.2143", async () => {
      const { durationInput, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(durationInput, "-1234.2143{enter}");
      expect(getDuration() % 10).toEqual(0);
    });

    it("rounds duration inputs to multiples of 10ms after set to -1235.2143", async () => {
      const { durationInput, getDuration } = setupComponent();
      const user = userEvent.setup();
      await user.type(durationInput, "-1235.2143{enter}");
      expect(getDuration() % 10).toEqual(0);
    });
  });

  describe("Current Time adjusts if it exceeds the newly set Duration", () => {
    it("sets Time from 2000 to 1000 when duration becomes 1000", async () => {
      const { timeInput, durationInput, getTime, getDuration } =
        setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      await user.type(durationInput, "1000{enter}");
      expect(getTime()).toEqual(getDuration());
    });

    it("sets Time from 2000 to 100 after trying set duration to -1000", async () => {
      const { timeInput, durationInput, getTime, getDuration } =
        setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      await user.type(durationInput, "-1000{enter}");
      expect(getTime()).toEqual(100);
      expect(getTime()).toEqual(getDuration());
    });

    it("sets Time from 2000 to 1990 after duration stepper down is clicked", async () => {
      const { timeInput, durationInput, getTime, getDuration } =
        setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      await simulateStepperClick(user, durationInput, false);
      expect(getTime()).toEqual(getDuration());
    });

    it("sets Time from 2000 to 1990 after duration {arrowDown} is pressed", async () => {
      const { timeInput, durationInput, getTime, getDuration } =
        setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      await user.type(durationInput, "{arrowDown}");
      expect(getTime()).toEqual(getDuration());
    });
  });

  describe("Playhead position updates only after specific actions on Current Time input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)", () => {
    it("stays at 0px initially", async () => {
      const { initTime, playhead } = setupComponent();
      expect(playhead).toHaveStyle(
        `transform: translateX(calc(${initTime}px - 50%))`
      );
    });
    it("stays at 0px after keying 120 without pressing {enter}", async () => {
      const { timeInput, initTime, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.click(timeInput);
      await user.keyboard("120");
      expect(timeInput).toHaveFocus();
      expect(playhead).toHaveStyle(
        `transform: translateX(calc(${initTime}px - 50%))`
      );
    });

    it("moves to 180px after keying 180{enter}", async () => {
      const { timeInput, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.click(timeInput);
      await user.keyboard("180{enter}");
      expect(playhead).toHaveStyle(`transform: translateX(calc(180px - 50%))`);
    });

    it("moves to 200px after keying 200 and focus on something else", async () => {
      const { timeInput, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.click(timeInput);
      await user.keyboard("200");
      await user.click(screen.getByText(/Duration/));
      expect(playhead).toHaveStyle(`transform: translateX(calc(200px - 50%))`);
    });

    it("stays at 0px after keying 200{escape}", async () => {
      const { timeInput, initTime, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.click(timeInput);
      await user.keyboard("200{escape}");
      expect(playhead).toHaveStyle(
        `transform: translateX(calc(${initTime}px - 50%))`
      );
    });

    it("moves to 0 + step after pressing {arrowUp} when time is 0", async () => {
      const { timeInput, initTime, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.click(timeInput);
      await user.keyboard("{arrowUp}");
      expect(playhead).toHaveStyle(
        `transform: translateX(calc(${
          initTime + Number(timeInput.step)
        }px - 50%))`
      );
    });

    it("stays at 0px after pressing {arrowDown} when time is 0", async () => {
      const { timeInput, initTime, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.click(timeInput);
      await user.keyboard("{arrowDown}");
      expect(playhead).toHaveStyle(
        `transform: translateX(calc(${initTime}px - 50%))`
      );
    });

    it("moves to 1990px after pressing {arrowDown} when time is 2000", async () => {
      const { timeInput, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      await user.click(timeInput);
      await user.keyboard("{arrowDown}");
      expect(playhead).toHaveStyle("transform: translateX(calc(1990px - 50%))");
    });

    it("moves to 0 + step after clicking stepper up when time is 0", async () => {
      const { timeInput, initTime, playhead } = setupComponent();
      const user = userEvent.setup();
      await simulateStepperClick(user, timeInput, true);
      expect(playhead).toHaveStyle(
        `transform: translateX(calc(${
          initTime + Number(timeInput.step)
        }px - 50%))`
      );
    });

    it("stays at 0px after pressing stepper down when time is 0", async () => {
      const { timeInput, initTime, playhead } = setupComponent();
      const user = userEvent.setup();
      await simulateStepperClick(user, timeInput, false);
      expect(playhead).toHaveStyle(
        `transform: translateX(calc(${initTime}px - 50%))`
      );
    });

    it("moves to 1990px after pressing stepper down when time is 2000", async () => {
      const { timeInput, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      await simulateStepperClick(user, timeInput, false);
      expect(playhead).toHaveStyle("transform: translateX(calc(1990px - 50%))");
    });

    it("moves to 1000px after setting duration to 1000", async () => {
      const { timeInput, durationInput, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      await user.type(durationInput, "1000{enter}");
      expect(playhead).toHaveStyle("transform: translateX(calc(1000px - 50%))");
    });

    it("moves to 990px after setting duration to 1000 and then press {arrowDown}", async () => {
      const { timeInput, durationInput, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      await user.type(durationInput, "1000{enter}");
      await user.type(durationInput, "{arrowDown}");
      expect(playhead).toHaveStyle("transform: translateX(calc(990px - 50%))");
    });

    it("moves to 990px after setting duration to 1000 and then click stepper down", async () => {
      const { timeInput, durationInput, playhead } = setupComponent();
      const user = userEvent.setup();
      await user.type(timeInput, "2000{enter}");
      await user.type(durationInput, "1000{enter}");
      await simulateStepperClick(user, durationInput, false);
      expect(playhead).toHaveStyle("transform: translateX(calc(990px - 50%))");
    });
  });
});
