export function ipToLong(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}

export function isIpInCidr(ip: string, cidr: string): boolean {
  const [network, bits] = cidr.split("/");
  const mask = -1 << (32 - parseInt(bits || "32", 10));
  const ipLong = ipToLong(ip);
  const networkLong = ipToLong(network);
  return (ipLong & mask) === (networkLong & mask);
}

export function isIpAllowed(ip: string, allowedNetworks: string[], allowLocalhost = false): boolean {
  if (allowLocalhost && (ip === "127.0.0.1" || ip === "::1" || ip.includes("localhost"))) {
    return true;
  }
  return allowedNetworks.some((network) => {
    if (network.includes("/")) {
      return isIpInCidr(ip, network);
    }
    return ip.startsWith(network.replace(/\*/g, ""));
  });
}
