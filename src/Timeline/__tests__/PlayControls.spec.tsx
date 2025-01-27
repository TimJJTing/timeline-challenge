import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayControls } from "../PlayControls";
import { useTimelineStore } from "../store";
const initialStoreState = useTimelineStore.getState();

// unit tests
describe("<PlayControls />", () => {
  it("renders", () => {
    render(<PlayControls />);
    expect(screen.getByTestId("play-controls")).toBeInTheDocument();
    expect(screen.getByTestId("current-time-input")).toBeInTheDocument();
    expect(screen.getByTestId("duration-input")).toBeInTheDocument();
  });
});

describe("Number Input Field behaviors", () => {
  const setupComponent = () => {
    // reset state
    useTimelineStore.setState(initialStoreState, true);
    render(<PlayControls />);
    return {
      initTime: useTimelineStore.getState().time,
      getTime: () => useTimelineStore.getState().time,
      input: screen.getByTestId("current-time-input") as HTMLInputElement,
    };
  };
  const simulateStepperClick = async (
    input: HTMLInputElement,
    increment: boolean
  ) => {
    // Simulate stepper button click by dispatching input event
    const newValue = increment
      ? Number(input.value) + Number(input.step)
      : Number(input.value) - Number(input.step);
    // Simulate clicking stepper
    fireEvent.change(input, {
      target: { value: String(newValue) },
    });
  };
  it("The displayed value updates immediately while typing, but onChange is not triggered until input is confirmed", async () => {
    const { input, initTime, getTime } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "1");
    expect(input).toHaveValue(1);

    await user.type(input, "2");
    expect(input).toHaveValue(12);
    expect(getTime()).toEqual(initTime);

    await user.type(input, "0");
    expect(input).toHaveValue(120);

    await user.type(input, "{enter}");
    expect(getTime()).toEqual(120);
  });

  it("Clicking outside the input field removes focus and changes the value", async () => {
    const { input, getTime } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "120");
    expect(input).toHaveValue(120);

    await user.click(screen.getByText(/Duration/));
    expect(input).not.toHaveFocus();

    expect(getTime()).toEqual(120);
  });

  it("Clicking on the native step buttons immediately changes the value", async () => {
    const { input, initTime, getTime } = setupComponent();
    await simulateStepperClick(input, true);
    expect(input).toHaveValue(initTime + Number(input.step));
    waitFor(() => expect(getTime()).toEqual(initTime + Number(input.step)));

    await simulateStepperClick(input, true);
    await simulateStepperClick(input, true);
    expect(input).toHaveValue(initTime + 3 * Number(input.step));
    waitFor(() => expect(getTime()).toEqual(initTime + 3 * Number(input.step)));

    await simulateStepperClick(input, false);
    expect(input).toHaveValue(initTime + 2 * Number(input.step));
    waitFor(() => expect(getTime()).toEqual(initTime + 2 * Number(input.step)));

    await simulateStepperClick(input, false);
    await simulateStepperClick(input, false);
    expect(input).toHaveValue(initTime);
    waitFor(() => expect(getTime()).toEqual(initTime));
  });

  it("Pressing up arrow or down arrow keys immediately changes the value", async () => {
    const { input, initTime, getTime } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "{arrowUp}");
    expect(input).toHaveValue(Number(input.step));
    waitFor(() => expect(getTime()).toEqual(Number(input.step)));

    await user.type(input, "{arrowUp}");
    await user.type(input, "{arrowUp}");
    expect(input).toHaveValue(initTime + 3 * Number(input.step));
    waitFor(() => expect(getTime()).toEqual(initTime + 3 * Number(input.step)));

    await user.type(input, "{arrowDown}");
    expect(input).toHaveValue(initTime + 2 * Number(input.step));
    waitFor(() => expect(getTime()).toEqual(initTime + 2 * Number(input.step)));

    await user.type(input, "{arrowDown}");
    await user.type(input, "{arrowDown}");
    expect(input).toHaveValue(initTime);
    waitFor(() => expect(getTime()).toEqual(initTime));
  });

  it("Entire text is selected when the input field gains focus", async () => {
    const { input } = setupComponent();
    const user = userEvent.setup();
    await user.click(input);
    expect(input).toHaveFocus();
    waitFor(() => expect(input).toHaveSelection(input.value));
  });

  it("Entire text is selected after using the native step buttons", async () => {
    const { input } = setupComponent();
    await simulateStepperClick(input, true);
    waitFor(() => {
      expect(input).toHaveFocus();
      expect(input).toHaveSelection(input.value);
    });
  });

  it("Entire text is selected after using the up arrow or down arrow keys", async () => {
    const { input } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "{arrowUp}");
    waitFor(() => {
      expect(input).toHaveFocus();
      expect(input).toHaveSelection(input.value);
    });

    await user.click(screen.getByText(/Duration/));
    await user.type(input, "{arrowDown}");
    waitFor(() => {
      expect(input).toHaveFocus();
      expect(input).toHaveSelection(input.value);
    });
  });

  it("Pressing Enter confirms the new value and removes focus", async () => {
    const { input, getTime } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "120");
    expect(input).toHaveFocus();

    await user.type(input, "{enter}");
    expect(input).toHaveValue(120);
    waitFor(() => {
      expect(getTime()).toEqual(120);
      expect(input).not.toHaveFocus();
    });
  });

  it("Pressing Escape reverts to the original value and removes focus", async () => {
    const { input, initTime, getTime } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "120");
    expect(input).toHaveFocus();

    await user.type(input, "{escape}");
    expect(input).toHaveValue(initTime);
    waitFor(() => {
      expect(getTime()).toEqual(initTime);
      expect(input).not.toHaveFocus();
    });

    await user.type(input, "120{enter}");
    await user.type(input, "2000{escape}");
    expect(input).toHaveValue(120);
    waitFor(() => {
      expect(getTime()).toEqual(120);
      expect(input).not.toHaveFocus();
    });
  });

  it("Leading zeros are automatically removed", async () => {
    const { input, getTime } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "0120{enter}");
    expect(input).toHaveValue(120);
    waitFor(() => expect(getTime()).toEqual(120));

    await user.type(input, "002000{enter}");
    expect(input).toHaveValue(2000);
    waitFor(() => expect(getTime()).toEqual(2000));
  });

  it("Negative values are automatically adjusted to the minimum allowed value", async () => {
    const { input, getTime } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "-120{enter}");
    expect(input).toHaveValue(Number(input.min));
    waitFor(() => expect(getTime()).toEqual(Number(input.min)));

    await user.type(input, "-2000{enter}");
    expect(input).toHaveValue(Number(input.min));
    waitFor(() => expect(getTime()).toEqual(Number(input.min)));
  });

  it("Decimal values are automatically rounded to the nearest integer", async () => {
    const { input, getTime } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "120.080{enter}");
    expect(input).toHaveValue(120);
    waitFor(() => expect(getTime()).toEqual(120));

    await user.type(input, "128.7{enter}");
    expect(input).toHaveValue(130);
    waitFor(() => expect(getTime()).toEqual(130));
  });

  it("Invalid inputs (non-numeric) revert to the previous valid value", async () => {
    const { input, initTime, getTime } = setupComponent();
    const user = userEvent.setup();
    await user.type(input, "abc{enter}");
    expect(input).toHaveValue(initTime);
    waitFor(() => expect(getTime()).toEqual(initTime));

    await user.type(input, "{space}{enter}");
    expect(input).toHaveValue(initTime);
    waitFor(() => expect(getTime()).toEqual(initTime));

    await user.type(input, "120{enter}");
    await user.type(input, "aaa{enter}");
    expect(input).toHaveValue(120);
    waitFor(() => expect(getTime()).toEqual(120));
  });
});
