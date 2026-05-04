import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("environment is test", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });

  it("basic arithmetic works", () => {
    expect(1 + 1).toBe(2);
  });
});
