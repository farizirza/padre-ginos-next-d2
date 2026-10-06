import { describe, expect, test } from "vitest";
import {
  canTransition,
  isOrderStatus,
  nextStatuses,
  ORDER_STATUSES,
} from "@/lib/orders";

describe("isOrderStatus", () => {
  test("accepts valid order statuses", () => {
    for (const status of ORDER_STATUSES) {
      expect(isOrderStatus(status)).toBe(true);
    }
  });

  test("rejects invalid statuses", () => {
    for (const invalid of ["shipped", "unknown", "", "PENDING", 123, null, undefined]) {
      expect(isOrderStatus(invalid)).toBe(false);
    }
  });
});

describe("nextStatuses", () => {
  test("returns correct transitions for pending", () => {
    expect(nextStatuses("pending")).toEqual(["preparing", "cancelled"]);
  });

  test("returns correct transitions for preparing", () => {
    expect(nextStatuses("preparing")).toEqual(["ready", "cancelled"]);
  });

  test("returns correct transitions for ready", () => {
    expect(nextStatuses("ready")).toEqual(["delivered"]);
  });

  test("returns empty array for final statuses", () => {
    expect(nextStatuses("delivered")).toEqual([]);
    expect(nextStatuses("cancelled")).toEqual([]);
  });
});

describe("canTransition", () => {
  test("allows valid transitions", () => {
    expect(canTransition("pending", "preparing")).toBe(true);
    expect(canTransition("pending", "cancelled")).toBe(true);
    expect(canTransition("preparing", "ready")).toBe(true);
    expect(canTransition("preparing", "cancelled")).toBe(true);
    expect(canTransition("ready", "delivered")).toBe(true);
  });

  test("rejects backwards or illegal transitions", () => {
    expect(canTransition("ready", "pending")).toBe(false);
    expect(canTransition("ready", "preparing")).toBe(false);
    expect(canTransition("ready", "cancelled")).toBe(false);
    expect(canTransition("delivered", "pending")).toBe(false);
    expect(canTransition("delivered", "cancelled")).toBe(false);
    expect(canTransition("cancelled", "pending")).toBe(false);
    expect(canTransition("pending", "delivered")).toBe(false);
  });
});
