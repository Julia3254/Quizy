// @vitest-environment node
import { describe, expect, it, afterEach } from "vitest";
import { GET } from "./route";

function requestWithHeaders(headers: Record<string, string>) {
  return new Request("http://localhost:3000/api/network", { headers });
}

describe("network API", () => {
  function setEnv(key: "QUIZ_WIFI_LOCK" | "QUIZ_ALLOWED_NETWORKS", value: string | undefined) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }

  const originalWifiLock = process.env.QUIZ_WIFI_LOCK;
  const originalNetworks = process.env.QUIZ_ALLOWED_NETWORKS;

  afterEach(() => {
    setEnv("QUIZ_WIFI_LOCK", originalWifiLock);
    setEnv("QUIZ_ALLOWED_NETWORKS", originalNetworks);
  });

  it("allows when wifi lock is disabled", async () => {
    process.env.QUIZ_WIFI_LOCK = "false";
    const response = await GET(requestWithHeaders({ "x-forwarded-for": "8.8.8.8" }) as any);
    const data = await response.json();
    expect(data.allowed).toBe(true);
    expect(data.wifiLock).toBe(false);
  });

  it("allows private IP when wifi lock is enabled", async () => {
    delete process.env.QUIZ_WIFI_LOCK;
    delete process.env.QUIZ_ALLOWED_NETWORKS;
    const response = await GET(requestWithHeaders({ "x-forwarded-for": "192.168.1.5" }) as any);
    const data = await response.json();
    expect(data.allowed).toBe(true);
    expect(data.wifiLock).toBe(true);
    expect(data.clientIp).toBe("192.168.1.5");
  });

  it("blocks external IP when wifi lock is enabled", async () => {
    delete process.env.QUIZ_WIFI_LOCK;
    process.env.QUIZ_ALLOWED_NETWORKS = "192.168.0.0/16";
    const response = await GET(requestWithHeaders({ "x-real-ip": "8.8.8.8" }) as any);
    const data = await response.json();
    expect(data.allowed).toBe(false);
    expect(data.clientIp).toBe("8.8.8.8");
  });

  it("uses first IP from x-forwarded-for", async () => {
    delete process.env.QUIZ_WIFI_LOCK;
    const response = await GET(requestWithHeaders({ "x-forwarded-for": "10.0.0.5, 192.168.1.1" }) as any);
    const data = await response.json();
    expect(data.clientIp).toBe("10.0.0.5");
    expect(data.allowed).toBe(true);
  });

  it("blocks localhost when wifi lock is enabled", async () => {
    delete process.env.QUIZ_WIFI_LOCK;
    const response = await GET(requestWithHeaders({ "x-real-ip": "127.0.0.1" }) as any);
    const data = await response.json();
    expect(data.allowed).toBe(false);
  });

  it("allows localhost when wifi lock is disabled", async () => {
    process.env.QUIZ_WIFI_LOCK = "false";
    const response = await GET(requestWithHeaders({ "x-real-ip": "127.0.0.1" }) as any);
    const data = await response.json();
    expect(data.allowed).toBe(true);
  });
});
