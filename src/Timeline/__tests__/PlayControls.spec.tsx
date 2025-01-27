import { render, screen } from "@testing-library/react";
import { PlayControls } from "../PlayControls";

// unit tests
describe("<PlayControls />", () => {
  beforeEach(() => {
    render(<PlayControls />);
  });
  it("renders", () => {
    expect(screen.getByTestId("play-controls")).toBeInTheDocument();
    expect(screen.getByTestId("current-time-input")).toBeInTheDocument();
    expect(screen.getByTestId("duration-input")).toBeInTheDocument();
  });
});
