const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const buffer = require("./buffer");
const delay = require("./delay");

describe("buffer", () => {
  describe("when given only a size", () => {
    it("defaults to a fixed buffer of that size", async () => {
      await expect(
        pipeline(emitItems(0, 1, 2, 3, 4, 5), buffer(3), delay(1)),
        "to yield items",
        [0, 1, 2, 3, 4, 5]
      );
    });
  });

  describe("when given a size the sliding strategy", () => {
    it("slides the values in the buffer when it gets full", async () => {
      await expect(
        pipeline(emitItems(0, 1, 2, 3, 4, 5), buffer(3, "sliding"), delay(1)),
        "to yield items",
        [3, 4, 5]
      );
    });
  });

  describe("when given a size the dropping strategy", () => {
    it("drops incoming values when the buffer is full", async () => {
      await expect(
        pipeline(emitItems(0, 1, 2, 3, 4, 5), buffer(3, "dropping"), delay(1)),
        "to yield items",
        [0, 1, 2]
      );
    });
  });
});
