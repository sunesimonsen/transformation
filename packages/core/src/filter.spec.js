const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const filter = require("./filter");

describe("filter", () => {
  it("filters items accoding to the given predicate", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        filter(n => n % 2 === 0)
      ),
      "to yield items",
      [0, 2, 4]
    );
  });
});
