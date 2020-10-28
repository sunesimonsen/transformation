const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");

describe("emitItems", () => {
  it("emits the given items on the output channel", async () => {
    await expect(emitItems(0, 1, 2, 3, 4, 5), "to yield items", [
      0,
      1,
      2,
      3,
      4,
      5
    ]);
  });
});
