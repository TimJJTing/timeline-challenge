import { render, screen } from "@testing-library/react";
import { Segment } from "../Segment";

// unit tests
describe("<Segment />", () => {
  beforeEach(() => {
    render(<Segment />);
  });
  it("renders", () => {
    expect(screen.getByTestId("segment")).toBeInTheDocument();
  });
});
