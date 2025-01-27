import { create } from "zustand";
import { DURATION, TIME } from "./config";

interface TimelineState {
  time: number;
  duration: number;
  setTime: (val: number | string) => number;
  setDuration: (val: number | string) => number;
  reset: () => void;
}

/**
 * Validate value before commit
 * @param value value to validate
 * @param oldValue original value
 * @param max max value allowed
 * @param min min value allowed
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

export const useTimelineStore = create<TimelineState>((set, get) => ({
  time: TIME.INIT,
  duration: DURATION.INIT,
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
  reset: () => {
    set(() => ({
      time: TIME.INIT,
      duration: DURATION.INIT,
    }));
  },
}));
