const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const uniq = require("./uniq");

describe("uniq", () => {
  it("emits uniq items", async () => {
    await expect(
      pipeline(emitItems(0, 4, 1, 2, 3, 0, 4, 5, 7, 6, 7, 8, 9, 9), uniq()),
      "to yield items",
      [0, 4, 1, 2, 3, 5, 7, 6, 8, 9]
    );
  });

  it("resets state for each invocation of the step", async () => {
    const uniqInPipeline = uniq({ scope: "pipeline" });

    await expect(
      pipeline(emitItems(0, 1, 2, 0, 3, 2), uniqInPipeline),
      "to yield items",
      [0, 1, 2, 3]
    );

    await expect(
      pipeline(emitItems(0, 1, 4), uniqInPipeline),
      "to yield items",
      [0, 1, 4]
    );
  });
});
