import React, { useState, useCallback, useRef } from "react";
import { useTimelineStore } from "./store";
import { DURATION, TIME } from "./config";

export const PlayControls = () => {
  const time = useTimelineStore((state) => state.time);
  const setTime = useTimelineStore((state) => state.setTime);
  const duration = useTimelineStore((state) => state.duration);
  const setDuration = useTimelineStore((state) => state.setDuration);

  // TODO: implement time <= maxTime
  const [tempTime, setTempTime] = useState<string>(String(time));
  const [tempDuration, setTempDuration] = useState<string>(String(duration));
  const timeInputRef = useRef<HTMLInputElement>(null);
  const durationInputRef = useRef<HTMLInputElement>(null);
  const commitTimeLockedRef = useRef<boolean>(false);
  const commitDurationLockedRef = useRef<boolean>(false);
  const stepTimeClickedRef = useRef<boolean>(false);
  const stepDurationClickedRef = useRef<boolean>(false);

  const commitTime = useCallback(
    (value: string) => {
      // console.log("commit");
      const newValue = setTime(value);
      setTempTime(String(newValue));
    },
    [setTime]
  );
  const commitDuration = useCallback(
    (value: string) => {
      // console.log("commit");
      const newValue = setDuration(value);
      setTempDuration(String(newValue));

      // Adjust current time if it exceeds the newly set Duration
      if (time > newValue) {
        commitTime(String(newValue));
      }
    },
    [setDuration, commitTime, time]
  );

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  const handleTimeBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      commitTime(e.target.value);
    },
    [commitTime]
  );
  const handleDurationBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      commitDuration(e.target.value);
    },
    [commitDuration]
  );

  const handleTimeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // console.log("keydown");
      const currentInput = timeInputRef.current;
      if (e.key === "Enter") {
        e.currentTarget.blur();
        commitTime(e.currentTarget.value);
      } else if (e.key === "Escape") {
        setTempTime(String(time));
        requestAnimationFrame(() => {
          currentInput?.blur();
        });
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const step = e.shiftKey ? TIME.STEP * 10 : TIME.STEP;
        const direction = e.key === "ArrowUp" ? 1 : -1;
        const newValue = String(time + step * direction);
        commitTime(String(newValue));
        commitTimeLockedRef.current = true; // lock it so it won't be trigged elsewhere
        requestAnimationFrame(() => {
          currentInput?.select();
        });
      } else {
        stepTimeClickedRef.current = false;
      }
    },
    [time, commitTime]
  );
  const handleDurationKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // console.log("keydown");
      const currentInput = durationInputRef.current;
      if (e.key === "Enter") {
        e.currentTarget.blur();
        commitDuration(e.currentTarget.value);
      } else if (e.key === "Escape") {
        setTempDuration(String(duration));
        requestAnimationFrame(() => {
          currentInput?.blur();
        });
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const step = e.shiftKey ? TIME.STEP * 10 : TIME.STEP;
        const direction = e.key === "ArrowUp" ? 1 : -1;
        const newValue = String(duration + step * direction);
        commitDuration(String(newValue));
        commitDurationLockedRef.current = true; // lock it so it won't be trigged elsewhere
        requestAnimationFrame(() => {
          currentInput?.select();
        });
      } else {
        stepDurationClickedRef.current = false;
      }
    },
    [duration, commitDuration]
  );

  const handleTimeClicked = useCallback(() => {
    // console.log("clicked");
    stepTimeClickedRef.current = true;
  }, []);
  const handleDurationClicked = useCallback(() => {
    // console.log("clicked");
    stepDurationClickedRef.current = true;
  }, []);

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // console.log("change");
      const stepClicked = stepTimeClickedRef.current;
      const commitLocked = commitTimeLockedRef.current;
      const currentInput = timeInputRef.current;
      commitTimeLockedRef.current = false;
      if (!stepClicked && !commitLocked) {
        // if not clicked and commit not locked, must be trigged from typing numbers
        setTempTime(e.target.value);
      } else if (!commitLocked) {
        // if clicked but commit not locked, must be trigged from clicking steppers
        commitTime(e.target.value);
        requestAnimationFrame(() => {
          currentInput?.select();
        });
      }
    },
    [commitTime]
  );
  const handleDurationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // console.log("change");
      const stepClicked = stepDurationClickedRef.current;
      const commitLocked = commitDurationLockedRef.current;
      const currentInput = durationInputRef.current;
      commitDurationLockedRef.current = false;
      if (!stepClicked && !commitLocked) {
        // if not clicked and commit not locked, must be trigged from typing numbers
        setTempDuration(e.target.value);
      } else if (!commitLocked) {
        // if clicked but commit not locked, must be trigged from clicking steppers
        commitDuration(e.target.value);
        requestAnimationFrame(() => {
          currentInput?.select();
        });
      }
    },
    [commitDuration]
  );

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 
 px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <input
          ref={timeInputRef}
          className="bg-gray-700 px-1 rounded"
          type="number"
          data-testid="current-time-input"
          min={TIME.MIN}
          max={duration}
          step={TIME.STEP}
          value={tempTime}
          onChange={handleTimeChange}
          onFocus={handleFocus}
          onBlur={handleTimeBlur}
          onMouseDown={handleTimeClicked}
          onKeyDown={handleTimeKeyDown}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <input
          ref={durationInputRef}
          className="bg-gray-700 px-1 rounded"
          type="number"
          data-testid="duration-input"
          min={DURATION.MIN}
          max={DURATION.MAX}
          step={TIME.STEP}
          value={tempDuration}
          onChange={handleDurationChange}
          onFocus={handleFocus}
          onBlur={handleDurationBlur}
          onMouseDown={handleDurationClicked}
          onKeyDown={handleDurationKeyDown}
        />
        Duration
      </fieldset>
    </div>
  );
};
