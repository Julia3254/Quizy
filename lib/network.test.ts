import { describe, expect, it } from "vitest";
import { ipToLong, isIpInCidr, isIpAllowed } from "./network";

describe("ipToLong", () => {
  it("converts IPv4 to long", () => {
    expect(ipToLong("192.168.1.1")).toBe(3232235777);
    expect(ipToLong("10.0.0.1")).toBe(167772161);
  });
});

describe("isIpInCidr", () => {
  it("returns true for IP inside CIDR", () => {
    expect(isIpInCidr("192.168.1.1", "192.168.0.0/16")).toBe(true);
    expect(isIpInCidr("10.0.5.5", "10.0.0.0/8")).toBe(true);
  });

  it("returns false for IP outside CIDR", () => {
    expect(isIpInCidr("192.169.1.1", "192.168.0.0/16")).toBe(false);
    expect(isIpInCidr("172.32.0.1", "172.16.0.0/12")).toBe(false);
  });
});

describe("isIpAllowed", () => {
  it("allows localhost when enabled", () => {
    expect(isIpAllowed("127.0.0.1", [], true)).toBe(true);
    expect(isIpAllowed("::1", [], true)).toBe(true);
  });

  it("blocks localhost when disabled", () => {
    expect(isIpAllowed("127.0.0.1", [], false)).toBe(false);
  });

  it("allows IP in default private networks", () => {
    const networks = ["192.168.0.0/16", "10.0.0.0/8", "172.16.0.0/12"];
    expect(isIpAllowed("192.168.1.5", networks)).toBe(true);
    expect(isIpAllowed("10.0.0.99", networks)).toBe(true);
    expect(isIpAllowed("172.20.10.2", networks)).toBe(true);
  });

  it("blocks IP outside allowed networks", () => {
    const networks = ["192.168.0.0/16"];
    expect(isIpAllowed("8.8.8.8", networks)).toBe(false);
  });

  it("supports wildcard prefix", () => {
    const networks = ["192.168.*"];
    expect(isIpAllowed("192.168.5.5", networks)).toBe(true);
    expect(isIpAllowed("192.169.5.5", networks)).toBe(false);
  });
});
