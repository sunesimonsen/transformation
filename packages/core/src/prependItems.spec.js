const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const pipeline = require("./pipeline");
const emitItems = require("./emitItems");
const prependItems = require("./prependItems");

describe("prependItems", () => {
  it("prepend the given items before all items in the pipeline", async () => {
    await expect(
      pipeline(
        emitItems(6, 7, 8),
        prependItems(3, 4, 5),
        prependItems(0, 1, 2)
      ),
      "to yield items",
      [0, 1, 2, 3, 4, 5, 6, 7, 8]
    );
  });
});
