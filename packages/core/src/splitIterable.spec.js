const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const splitIterable = require("./splitIterable");

describe("splitIterable", () => {
  it("re-emits all items in the iterables as individual items", async () => {
    await expect(
      pipeline(emitItems(0, [1, 2], [3, 4, 5]), splitIterable()),
      "to yield items",
      [0, 1, 2, 3, 4, 5]
    );
  });
});
