import { render, screen } from "@testing-library/react";
import { KeyframeList } from "../KeyframeList";

// unit tests
describe("<KeyframeList />", () => {
  beforeEach(() => {
    render(<KeyframeList />);
  });
  it("renders", () => {
    expect(screen.getByTestId("keyframe-list")).toBeInTheDocument();
  });
  it("renders <Segment />", () => {
    expect(screen.getAllByTestId("segment")[0]).toBeInTheDocument();
  });
});
