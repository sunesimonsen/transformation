const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const deduplicate = require("./deduplicate");

describe("deduplicate", () => {
  it("emits deduplicated items", async () => {
    await expect(
      pipeline(
        emitItems(0, 0, 4, 1, 1, 1, 1, 1, 2, 3, 0, 4, 1, 5, 7, 6, 7, 8, 9, 9),
        deduplicate()
      ),
      "to yield items",
      [0, 4, 1, 2, 3, 0, 4, 1, 5, 7, 6, 7, 8, 9]
    );
  });
});
