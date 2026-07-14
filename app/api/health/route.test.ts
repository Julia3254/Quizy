// @vitest-environment node
import { describe, expect, it, afterEach } from "vitest";
import { GET } from "./route";

describe("health API", () => {
  function setEnv(key: "UPSTASH_REDIS_REST_URL" | "UPSTASH_REDIS_REST_TOKEN", value: string | undefined) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }

  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  afterEach(() => {
    setEnv("UPSTASH_REDIS_REST_URL", originalUrl);
    setEnv("UPSTASH_REDIS_REST_TOKEN", originalToken);
  });

  it("returns ok and app name", async () => {
    const response = await GET();
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.app).toBe("AI Quiz MVP");
  });

  it("reports redis not configured", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    const response = await GET();
    const data = await response.json();
    expect(data.redisConfigured).toBe(false);
  });

  it("reports redis configured", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
    const response = await GET();
    const data = await response.json();
    expect(data.redisConfigured).toBe(true);
  });
});
