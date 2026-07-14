import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Leaderboard } from "./Leaderboard";

describe("Leaderboard", () => {
  it("renders empty state when ranking is empty", () => {
    render(<Leaderboard ranking={[]} variant="mobile" period="daily" />);
    expect(screen.getByText(/jeszcze nikt nie zagrał/i)).toBeInTheDocument();
  });

  it("renders ranking entries", () => {
    const ranking = [
      { nick: "Anna", score: 100 },
      { nick: "Bob", score: 80 },
      { nick: "Cecil", score: 60 },
    ];
    render(<Leaderboard ranking={ranking} variant="mobile" period="daily" />);
    expect(screen.getByText("Anna")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("100 pkt")).toBeInTheDocument();
  });

  it("shows period label", () => {
    render(<Leaderboard ranking={[]} variant="tv" period="weekly" />);
    expect(screen.getByText(/tygodniowo/i)).toBeInTheDocument();
  });
});
