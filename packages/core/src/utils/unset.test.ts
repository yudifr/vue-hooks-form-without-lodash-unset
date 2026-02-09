import { describe, expect, it } from "vitest";
import { unset } from "./unset";

describe("unset", () => {
  it("should remove a top-level property", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = unset(obj, "b");

    expect(result).toBe(true);
    expect(obj).toEqual({ a: 1, c: 3 });
    expect("b" in obj).toBe(false);
  });

  it("should remove a nested property using dot notation", () => {
    const obj = { a: { b: { c: 1 } }, d: 2 };
    const result = unset(obj, "a.b.c");

    expect(result).toBe(true);
    expect(obj).toEqual({ a: { b: {} }, d: 2 });
  });

  it("should remove a nested property using array path", () => {
    const obj = { a: { b: { c: 1 } }, d: 2 };
    const result = unset(obj, ["a", "b", "c"]);

    expect(result).toBe(true);
    expect(obj).toEqual({ a: { b: {} }, d: 2 });
  });

  it("should return true when property does not exist (lodash behavior)", () => {
    const obj = { a: 1, b: 2 };
    const result = unset(obj, "c");

    // lodash.unset returns true even if the property doesn't exist
    expect(result).toBe(true);
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it("should return true when nested path does not exist (lodash behavior)", () => {
    const obj = { a: { b: 1 } };
    const result = unset(obj, "a.c.d");

    // lodash.unset returns true even if the path doesn't exist
    expect(result).toBe(true);
    expect(obj).toEqual({ a: { b: 1 } });
  });

  it("should handle symbol keys", () => {
    const sym = Symbol("test");
    const obj = { [sym]: 1, b: 2 };

    // Note: lodash.unset also returns true for symbols (even though they get stringified)
    const result = unset(obj, sym as any);

    // Symbol gets converted to string "Symbol(test)" which won't match the symbol key
    // But lodash still returns true
    expect(result).toBe(true);
    expect(obj).toEqual({ [sym]: 1, b: 2 });
  });

  it("should handle number keys", () => {
    const obj = { 0: "a", 1: "b", 2: "c" };
    const result = unset(obj, 1);

    expect(result).toBe(true);
    expect(obj).toEqual({ 0: "a", 2: "c" });
  });

  it("should return true for null object (lodash behavior)", () => {
    const result = unset(null, "a");
    // lodash.unset returns true for null/undefined
    expect(result).toBe(true);
  });

  it("should return true for undefined object (lodash behavior)", () => {
    const result = unset(undefined, "a");
    // lodash.unset returns true for null/undefined
    expect(result).toBe(true);
  });

  it("should return true for primitive values (lodash behavior)", () => {
    // lodash.unset returns true for primitives
    expect(unset(123, "a")).toBe(true);
    expect(unset("string", "a")).toBe(true);
    expect(unset(true, "a")).toBe(true);
  });

  it("should handle empty path array", () => {
    const obj = { a: 1 };
    const result = unset(obj, []);

    // lodash.unset returns true for empty path
    expect(result).toBe(true);
    expect(obj).toEqual({ a: 1 });
  });

  it("should work with reactive objects (Vue use case)", () => {
    // Simulating the actual usage in createFormControl.ts
    // When using lodash.set/unset, 'user.name' is treated as a nested path
    const errors = {
      user: {
        name: { message: "Required" },
        email: { message: "Invalid" },
      },
    };

    unset(errors, "user.name");
    expect(errors).toEqual({
      user: {
        email: { message: "Invalid" },
      },
    });
  });

  it("should work with nested objects (Vue use case)", () => {
    // Simulating nested dirtyFields structure
    const dirtyFields = {
      user: {
        name: true,
        email: true,
      },
      settings: true,
    };

    unset(dirtyFields, "user.name");
    expect(dirtyFields).toEqual({
      user: { email: true },
      settings: true,
    });
  });

  it("should handle array indices in path", () => {
    const obj = {
      items: [{ name: "first" }, { name: "second" }, { name: "third" }],
    };

    unset(obj, "items.1.name");
    expect(obj.items[1]).toEqual({});
  });
});
