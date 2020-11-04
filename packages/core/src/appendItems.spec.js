const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const pipeline = require("./pipeline");
const emitItems = require("./emitItems");
const appendItems = require("./appendItems");

describe("appendItems", () => {
  it("appends the given items after all items in the pipeline", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2), appendItems(3, 4, 5), appendItems(6, 7, 8)),
      "to yield items",
      [0, 1, 2, 3, 4, 5, 6, 7, 8]
    );
  });
});
