const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const toArray = require("./toArray");

describe("toArray", () => {
  it("collects all the input values and emits an array", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5), toArray()),
      "to yield items",
      [[0, 1, 2, 3, 4, 5]]
    );
  });
});
