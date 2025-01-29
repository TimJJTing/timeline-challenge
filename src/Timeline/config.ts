// Timeline configuration

interface DurationConfig {
  readonly INIT: number;
  readonly MIN: number;
  readonly MAX: number;
}
interface TimeConfig {
  readonly INIT: number;
  readonly MIN: number;
  readonly STEP: number;
}
export const DURATION: DurationConfig = {
  INIT: 2000,
  MIN: 100,
  MAX: 6000,
};
export const TIME: TimeConfig = {
  INIT: 0,
  MIN: 0,
  STEP: 10,
};
