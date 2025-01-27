import { render, screen } from "@testing-library/react";
import { TrackList } from "../TrackList";

// unit tests
describe("<TrackList />", () => {
  beforeEach(() => {
    render(<TrackList />);
  });
  it("renders", () => {
    expect(screen.getByTestId("track-list")).toBeInTheDocument();
  });
});
