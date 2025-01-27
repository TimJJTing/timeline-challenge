import { render, screen } from "@testing-library/react";
import { Ruler } from "../Ruler";

// unit tests
describe("<Ruler />", () => {
  beforeEach(() => {
    render(<Ruler />);
  });
  it("renders", () => {
    expect(screen.getByTestId("ruler")).toBeInTheDocument();
    expect(screen.getByTestId("ruler-bar")).toBeInTheDocument();
  });
});
