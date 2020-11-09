const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const sort = require("./sort");

describe("sort", () => {
  it("sorts items with the build-in array sort", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 5, 7, 8, 2, 3, 4, 5), sort()),
      "to yield items",
      [0, 1, 2, 2, 3, 3, 4, 5, 5, 7, 8]
    );
  });

  describe("when given a comparison", () => {
    it("uses the comparison to compare items", async () => {
      await expect(
        pipeline(
          emitItems(0, 1, 2, 3, 5, 7, 8, 2, 3, 4, 5),
          sort((a, b) => b - a)
        ),
        "to yield items",
        [8, 7, 5, 5, 4, 3, 3, 2, 2, 1, 0]
      );
    });
  });
});
