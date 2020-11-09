const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const flatMap = require("./flatMap");

describe("flatMap", () => {
  it("transforms each item with the given mapper flattens any arrays returned from the mapper", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        flatMap((n) => (n % 2 === 0 ? [n, n] : n))
      ),
      "to yield items",
      [0, 0, 1, 2, 2, 3, 4, 4, 5]
    );
  });
});
