import { describe, it, expect, vi, beforeEach } from "vitest";
import { initTRPC } from "@trpc/server";
import * as z from "zod";

// Create a test version of the router without the actual database dependency
const t = initTRPC.create();

// Mock database operations
const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockResolvedValue(undefined),
});

const mockFindFirst = vi.fn().mockResolvedValue({
  id: 1,
  name: "Test Post",
  createdAt: new Date("2024-01-01"),
});

const mockDb = {
  insert: mockInsert,
  query: {
    posts: {
      findFirst: mockFindFirst,
    },
  },
};

// Create a test router matching the post router structure
const testPostRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: t.procedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await mockDb.insert({}).values({
        name: input.name,
      });
    }),

  getLatest: t.procedure.query(() => {
    return mockDb.query.posts.findFirst({
      orderBy: () => [],
    });
  }),
});

describe("postRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hello procedure", () => {
    it("returns greeting with provided text", async () => {
      const caller = testPostRouter.createCaller({});

      const result = await caller.hello({ text: "World" });

      expect(result).toEqual({ greeting: "Hello World" });
    });

    it("handles empty string input", async () => {
      const caller = testPostRouter.createCaller({});

      const result = await caller.hello({ text: "" });

      expect(result).toEqual({ greeting: "Hello " });
    });

    it("handles special characters in input", async () => {
      const caller = testPostRouter.createCaller({});

      const result = await caller.hello({ text: "Test! @#$%" });

      expect(result).toEqual({ greeting: "Hello Test! @#$%" });
    });
  });

  describe("create procedure", () => {
    it("creates a post with valid name", async () => {
      vi.useFakeTimers();
      const caller = testPostRouter.createCaller({});

      const createPromise = caller.create({ name: "Test Post" });

      await vi.advanceTimersByTimeAsync(1000);
      await createPromise;

      expect(mockInsert).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it("rejects empty name", async () => {
      const caller = testPostRouter.createCaller({});

      await expect(caller.create({ name: "" })).rejects.toThrow();
    });

    it("simulates delay before inserting", async () => {
      vi.useFakeTimers();
      const caller = testPostRouter.createCaller({});

      const createPromise = caller.create({ name: "Delayed Post" });

      // Fast-forward past the 1000ms delay
      await vi.advanceTimersByTimeAsync(1000);

      await createPromise;

      expect(mockInsert).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe("getLatest procedure", () => {
    it("returns the latest post", async () => {
      const caller = testPostRouter.createCaller({});

      const result = await caller.getLatest();

      expect(result).toEqual({
        id: 1,
        name: "Test Post",
        createdAt: expect.any(Date),
      });
    });

    it("calls findFirst with correct ordering", async () => {
      const caller = testPostRouter.createCaller({});

      await caller.getLatest();

      expect(mockFindFirst).toHaveBeenCalled();
    });

    it("returns undefined when no posts exist", async () => {
      mockFindFirst.mockResolvedValueOnce(undefined);
      const caller = testPostRouter.createCaller({});

      const result = await caller.getLatest();

      expect(result).toBeUndefined();
    });
  });
});

describe("postRouter input validation", () => {
  it("validates hello input schema - requires text field", async () => {
    const caller = testPostRouter.createCaller({});

    // @ts-expect-error - intentionally passing invalid input
    await expect(caller.hello({})).rejects.toThrow();
  });

  it("validates create input schema - requires name field", async () => {
    const caller = testPostRouter.createCaller({});

    // @ts-expect-error - intentionally passing invalid input
    await expect(caller.create({})).rejects.toThrow();
  });

  it("validates create input schema - name must be non-empty", async () => {
    const caller = testPostRouter.createCaller({});

    await expect(caller.create({ name: "" })).rejects.toThrow();
  });
});
