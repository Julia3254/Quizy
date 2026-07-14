import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TvScreen } from "./TvScreen";

describe("TvScreen", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ ok: true, ranking: [] }),
    } as any);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("renders TV screen header", async () => {
    render(<TvScreen />);
    expect(await screen.findByText(/top wyników/i)).toBeInTheDocument();
  });

  it("renders empty ranking message", async () => {
    render(<TvScreen />);
    expect(await screen.findByText(/jeszcze nikt nie zagrał/i)).toBeInTheDocument();
  });
});
