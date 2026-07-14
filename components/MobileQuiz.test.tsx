import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileQuiz } from "./MobileQuiz";

describe("MobileQuiz", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ allowed: true, wifiLock: false }),
    } as any);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("renders intro screen", async () => {
    render(<MobileQuiz />);
    expect(await screen.findByText(/gotowy na quiz\?/i)).toBeInTheDocument();
  });

  it("renders network check result", async () => {
    render(<MobileQuiz />);
    expect(await screen.findByLabelText(/start/i)).toBeInTheDocument();
  });
});
