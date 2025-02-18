import { create } from "zustand";
import { DURATION, TIME } from "./config";
interface TimelineState {
  time: number;
  duration: number;
}
interface TimelineActions {
  setTime: (val: number | string) => number;
  setDuration: (val: number | string) => number;
  reset: () => void;
}

/**
 * Validate value before commit
 * @param {number | string} value value to validate
 * @param {number} oldValue original value
 * @param {number} max max value allowed
 * @param {number} min min value allowed
 * @returns validated value
 */
const validateAndFormatValue = (
  value: number | string,
  oldValue: number,
  max: number,
  min: number = 0
): number => {
  if (typeof value === "string") {
    value = parseInt(value, 10);
    if (isNaN(value)) return oldValue;
  }
  value = Math.round(value / TIME.STEP) * TIME.STEP;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const initialTimelineState: TimelineState = {
  time: TIME.INIT,
  duration: DURATION.INIT,
};

export const useTimelineStore = create<TimelineState & TimelineActions>(
  (set, get) => ({
    ...initialTimelineState,
    // set time with respect to the constraints
    setTime: (value) => {
      const newValue = validateAndFormatValue(
        value,
        get().time,
        get().duration,
        TIME.MIN
      );
      set(() => ({
        time: newValue,
      }));
      return newValue;
    },
    // set duration with respect to the constraints
    setDuration: (value) => {
      const newValue = validateAndFormatValue(
        value,
        get().duration,
        DURATION.MAX,
        DURATION.MIN
      );
      set(() => ({
        duration: newValue,
      }));
      return newValue;
    },
    // reset time and duration to initial values
    reset: () => {
      set(initialTimelineState);
    },
  })
);

interface ScrollState {
  scrollLeft: number;
  scrollTop: number;
}
interface ScrollActions {
  setScrollLeft: (val: number | undefined | null) => void;
  setScrollTop: (val: number | undefined | null) => void;
  reset: () => void;
}

const initialScrollState: ScrollState = {
  scrollLeft: 0,
  scrollTop: 0,
};

export const useScrollStore = create<ScrollState & ScrollActions>((set) => ({
  ...initialScrollState,
  setScrollLeft: (value) => {
    if (value !== null && value !== undefined) {
      set(() => ({
        scrollLeft: value,
      }));
    }
  },
  setScrollTop: (value) => {
    if (value !== null && value !== undefined) {
      set(() => ({
        scrollTop: value,
      }));
    }
  },
  // reset scroll to initial values
  reset: () => {
    set(initialScrollState);
  },
}));
