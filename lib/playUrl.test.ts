import { describe, expect, it, afterEach } from "vitest";
import { getPublicPlayUrl } from "./playUrl";

describe("getPublicPlayUrl", () => {
  const original = process.env.NEXT_PUBLIC_APP_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = original;
  });

  it("uses NEXT_PUBLIC_APP_URL when configured", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://quiz.example.com";
    expect(getPublicPlayUrl("http://fallback.com")).toBe("https://quiz.example.com/play");
  });

  it("removes trailing slash from configured URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://quiz.example.com/";
    expect(getPublicPlayUrl()).toBe("https://quiz.example.com/play");
  });

  it("falls back to origin when env is not set", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(getPublicPlayUrl("https://origin.com")).toBe("https://origin.com/play");
  });

  it("returns /play when nothing is provided", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(getPublicPlayUrl()).toBe("/play");
  });
});
