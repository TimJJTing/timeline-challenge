import React, { useState, useCallback, useRef } from "react";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
};

export const PlayControls = ({ time, setTime }: PlayControlsProps) => {
  // TODO: implement time <= maxTime
  const [tempValue, setTempValue] = useState<string>(String(time));
  const currentInputRef = useRef<HTMLInputElement>(null);
  const durationInputRef = useRef<HTMLInputElement>(null);
  const previousValidValueRef = useRef(time);
  const commitLockedRef = useRef<boolean>(false);
  const stepClickedRef = useRef<boolean>(false);

  const validateAndFormatValue = (value: string): number => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return previousValidValueRef.current;
    if (numValue < 0) return 0;
    if (numValue > 2000) return 2000;
    return numValue;
  };

  const commitValue = (value: string) => {
    // console.log("commit");
    const validValue = validateAndFormatValue(value);
    previousValidValueRef.current = validValue;
    setTime(validValue);
    setTempValue(String(validValue));
  };

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    commitValue(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // console.log("keydown");
      const currentInput = currentInputRef.current;
      const previousValidValue = previousValidValueRef.current;
      if (e.key === "Enter") {
        e.currentTarget.blur();
        commitValue(e.currentTarget.value);
      } else if (e.key === "Escape") {
        setTempValue(String(previousValidValue));
        requestAnimationFrame(() => {
          currentInput?.blur();
        });
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const step = e.shiftKey ? 100 : 10;
        const direction = e.key === "ArrowUp" ? 1 : -1;
        const newValue = validateAndFormatValue(
          String(time + step * direction)
        );
        commitValue(String(newValue));
        commitLockedRef.current = true; // lock it so it won't be trigged elsewhere
        requestAnimationFrame(() => {
          currentInput?.select();
        });
      } else {
        stepClickedRef.current = false;
      }
    },
    [time]
  );

  const handleClicked = useCallback(() => {
    // console.log("clicked");
    stepClickedRef.current = true;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // console.log("change");
      const stepClicked = stepClickedRef.current;
      const commitLocked = commitLockedRef.current;
      const currentInput = currentInputRef.current;
      commitLockedRef.current = false;
      if (!stepClicked && !commitLocked) {
        // if not clicked and commit not locked, must be trigged from typing numbers
        setTempValue(e.target.value);
      } else if (!commitLocked) {
        // if clicked but commit not locked, must be trigged from clicking steppers
        commitValue(e.target.value);
        requestAnimationFrame(() => {
          currentInput?.select();
        });
      }
    },
    []
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
          ref={currentInputRef}
          className="bg-gray-700 px-1 rounded"
          type="number"
          data-testid="current-time-input"
          min={0}
          max={2000}
          step={10}
          value={tempValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={handleClicked}
          onKeyDown={handleKeyDown}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <input
          ref={durationInputRef}
          className="bg-gray-700 px-1 rounded"
          type="number"
          data-testid="duration-input"
          min={100}
          max={2000}
          step={10}
          defaultValue={2000}
          onFocus={handleFocus}
        />
        Duration
      </fieldset>
    </div>
  );
};
