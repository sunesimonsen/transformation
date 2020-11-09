const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const reduce = require("./reduce");

describe("reduce", () => {
  it("reduces all items on the channel into one value", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        reduce((sum, n) => sum + n, 0)
      ),
      "to yield items",
      [15]
    );
  });
});
