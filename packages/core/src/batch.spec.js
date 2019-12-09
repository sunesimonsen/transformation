const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const batch = require("./batch");

describe("batch", () => {
  it("creates arrays with the given batch size", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5, 6), batch(2)),
      "to yield items",
      [[0, 1], [2, 3], [4, 5], [6]]
    );
  });
});
