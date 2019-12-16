const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const splitArray = require("./splitArray");

describe("splitArray", () => {
  it("re-emits all items in arrays as individual items", async () => {
    await expect(
      pipeline(emitItems(0, [1, 2], [3, 4, 5]), splitArray()),
      "to yield items",
      [0, 1, 2, 3, 4, 5]
    );
  });
});
