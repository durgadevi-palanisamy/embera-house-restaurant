import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, generateToken, verifyToken } from "../src/lib/auth";

describe("Authentication & Cryptography", () => {
  it("hashes and validates passwords using bcrypt safely", async () => {
    const rawPassword = "EmberaLuxury2026!#";
    const hash = await hashPassword(rawPassword);
    
    expect(hash).not.toBe(rawPassword);
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

    const isMatch = await verifyPassword(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrong = await verifyPassword("WrongPassword123", hash);
    expect(isWrong).toBe(false);
  });

  it("generates and verifies JWT tokens for session users", () => {
    const userPayload = {
      id: "usr_998877",
      name: "Lord Julian Sterling",
      email: "julian@sterling.co.uk",
      role: "CUSTOMER",
    };

    const token = generateToken(userPayload);
    expect(typeof token).toBe("string");

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe("julian@sterling.co.uk");
    expect(decoded?.role).toBe("CUSTOMER");
  });
});
