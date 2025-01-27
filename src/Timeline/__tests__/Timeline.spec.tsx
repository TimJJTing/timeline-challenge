import { render, screen } from "@testing-library/react";
import { Timeline } from "../Timeline";

// unit tests
describe("<Timeline />", () => {
  beforeEach(() => {
    render(<Timeline />);
  });
  it("renders", () => {
    expect(screen.getByTestId("timeline")).toBeInTheDocument();
  });
  it("renders <PlayControls />", () => {
    expect(screen.getByTestId("play-controls")).toBeInTheDocument();
  });
  it("renders <Ruler />", () => {
    expect(screen.getByTestId("ruler")).toBeInTheDocument();
  });
  it("renders <TrackList />", () => {
    expect(screen.getByTestId("track-list")).toBeInTheDocument();
  });
  it("renders <KeyframeList />", () => {
    expect(screen.getByTestId("keyframe-list")).toBeInTheDocument();
  });
  it("renders <Playhead />", () => {
    expect(screen.getByTestId("playhead")).toBeInTheDocument();
  });
});
