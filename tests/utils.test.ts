import { describe, it, expect } from "vitest";
import { formatCurrency, generateConfirmationCode, slugify, formatDate } from "../src/lib/utils";

describe("Utility Functions", () => {
  it("formats Indian Rupees (INR / ₹) accurately", () => {
    const formatted1 = formatCurrency(1250);
    const formatted2 = formatCurrency(6500);
    expect(formatted1).toContain("1,250");
    expect(formatted2).toContain("6,500");
    expect(formatted1).toContain("₹");
  });

  it("generates unique confirmation codes with EH- prefix", () => {
    const code1 = generateConfirmationCode();
    const code2 = generateConfirmationCode();
    expect(code1).toMatch(/^EH-[A-Z0-9]{6}$/);
    expect(code2).toMatch(/^EH-[A-Z0-9]{6}$/);
    expect(code1).not.toEqual(code2);
  });

  it("slugifies titles into clean kebab-case", () => {
    expect(slugify("Charred Morel & Truffle Galouti")).toBe("charred-morel-truffle-galouti");
    expect(slugify("Wine & Fire: An Evening with Sula & Fratelli Reserve")).toBe("wine-fire-an-evening-with-sula-fratelli-reserve");
  });

  it("formats dates gracefully", () => {
    const formatted = formatDate("2026-09-24");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("September");
  });
});
