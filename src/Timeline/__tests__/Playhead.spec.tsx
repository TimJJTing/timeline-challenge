import { render, screen } from "@testing-library/react";
import { Playhead } from "../Playhead";

// unit tests
describe("<Playhead />", () => {
  beforeEach(() => {
    render(<Playhead />);
  });
  it("renders", () => {
    expect(screen.getByTestId("playhead")).toBeInTheDocument();
  });
});
