const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const reverse = require("./reverse");

describe("reverse", () => {
  it("reverses the items on then channel", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5), reverse()),
      "to yield items",
      [5, 4, 3, 2, 1, 0]
    );
  });
});
