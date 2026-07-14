// @vitest-environment node
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";
import { promises as dns } from "dns";

describe("validate-email API", () => {
  const originalResolveMx = dns.resolveMx;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    dns.resolveMx = originalResolveMx;
  });

  function jsonRequest(body: object) {
    return new Request("http://localhost:3000/api/validate-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("accepts email with valid format and MX records", async () => {
    dns.resolveMx = vi.fn().mockResolvedValue([{ exchange: "mail.example.com", priority: 10 }]);
    const response = await POST(jsonRequest({ email: "test@example.com" }) as any);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  it("rejects invalid email format", async () => {
    const response = await POST(jsonRequest({ email: "not-an-email" }) as any);
    const data = await response.json();
    expect(data.ok).toBe(false);
  });

  it("rejects missing email", async () => {
    const response = await POST(jsonRequest({}) as any);
    const data = await response.json();
    expect(data.ok).toBe(false);
  });

  it("rejects domain without MX records", async () => {
    dns.resolveMx = vi.fn().mockResolvedValue([]);
    const response = await POST(jsonRequest({ email: "test@example.com" }) as any);
    const data = await response.json();
    expect(data.ok).toBe(false);
  });

  it("rejects when DNS lookup fails", async () => {
    dns.resolveMx = vi.fn().mockRejectedValue(new Error("DNS error"));
    const response = await POST(jsonRequest({ email: "test@example.com" }) as any);
    const data = await response.json();
    expect(data.ok).toBe(false);
  });
});
