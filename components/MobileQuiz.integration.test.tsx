import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MobileQuiz } from "./MobileQuiz";

describe("MobileQuiz integration", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      if (url === "/api/network") {
        return { json: async () => ({ allowed: true, wifiLock: false }) } as Response;
      }
      if (url === "/api/validate-email") {
        return { json: async () => ({ ok: true }) } as Response;
      }
      if (url === "/api/session" && init?.method === "POST") {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            sessionId: "test-session",
            question: { id: 1, text: "Pytanie testowe", answers: ["A", "B", "C"] },
            timeLeft: 90,
            score: 0,
          }),
        } as Response;
      }
      if (url === "/api/session" && init?.method === "PATCH") {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            isCorrect: true,
            score: 10,
            lives: 3,
            correctIndex: 0,
            gameOver: false,
            question: { id: 2, text: "Drugie pytanie", answers: ["X", "Y", "Z"] },
            timeLeft: 90,
          }),
        } as Response;
      }
      return { json: async () => ({}) } as Response;
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("starts a game after filling nick and email", async () => {
    render(<MobileQuiz />);

    const startButton = await screen.findByLabelText(/start/i);
    fireEvent.click(startButton);

    const nickInput = await screen.findByPlaceholderText(/wpisz nick/i);
    const emailInput = screen.getByPlaceholderText(/wpisz e-mail/i);
    const submitButton = screen.getByRole("button", { name: /rozpocznij/i });

    fireEvent.change(nickInput, { target: { value: "Tester" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.blur(emailInput);

    const termsCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(termsCheckbox);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/pytanie testowe/i)).toBeInTheDocument();
    });
  });
});
