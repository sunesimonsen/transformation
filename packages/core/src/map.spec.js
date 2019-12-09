const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const map = require("./map");

describe("map", () => {
  it("transforms each item with the given mapper", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        map(n => n * n)
      ),
      "to yield items",
      [0, 1, 4, 9, 16, 25]
    );
  });
});
