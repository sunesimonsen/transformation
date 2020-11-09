const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const memorize = require("./memorize");
const map = require("./map");

describe("memorize", () => {
  it("defaults to use the value as the cache key", async () => {
    let i = 0;

    await expect(
      pipeline(
        emitItems(0, 1, 2, 0, 1, 2, 0, 1, 2),
        memorize(map((v) => `${v}: ${i++}`))
      ),
      "to yield items",
      ["0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2"]
    );
  });

  describe("when given no max size", () => {
    it("defaults to an infinite cache", async () => {
      let i = 0;

      await expect(
        pipeline(
          emitItems(0, 1, 2, 0, 1, 2, 0, 1, 2),
          memorize(map((v) => `${v}: ${i++}`))
        ),
        "to yield items",
        ["0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2"]
      );
    });
  });

  describe("when given a max size", () => {
    it("defaults to an infinite cache", async () => {
      let i = 0;

      await expect(
        pipeline(
          emitItems(0, 1, 2, 0, 1, 2, 0, 1, 2),
          memorize(
            map((v) => `${v}: ${i++}`),
            { maxSize: 2 }
          )
        ),
        "to yield items",
        ["0: 0", "1: 1", "2: 2", "0: 0", "1: 3", "2: 2", "0: 4", "1: 3", "2: 5"]
      );
    });
  });

  describe("when given a field for the cache key", () => {
    it("uses that for caching", async () => {
      let i = 0;

      await expect(
        pipeline(
          emitItems(0, 1, 2, 0, 1, 2, 0, 1, 2),
          map((key) => ({ key, time: i++ })),
          memorize(
            map(({ key, time }) => `${key}: ${time}`),
            { key: "key" }
          )
        ),
        "to yield items",
        ["0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2"]
      );
    });
  });

  describe("when given a selector for the cache key", () => {
    it("uses that for caching", async () => {
      let i = 0;

      await expect(
        pipeline(
          emitItems(0, 1, 2, 0, 1, 2, 0, 1, 2),
          map((key) => ({ key, time: i++ })),
          memorize(
            map(({ key, time }) => `${key}: ${time}`),
            { key: (v) => v.key }
          )
        ),
        "to yield items",
        ["0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2"]
      );
    });
  });
});
