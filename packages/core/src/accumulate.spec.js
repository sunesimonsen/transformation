const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const accumulate = require("./accumulate");

describe("accumulate", () => {
  it("transforms each item with the given mapper allowing you to getting the previous result", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        accumulate((n, previous) => ({ n, total: previous.total + n }), {
          total: 0,
        })
      ),
      "to yield items",
      [
        { n: 0, total: 0 },
        { n: 1, total: 1 },
        { n: 2, total: 3 },
        { n: 3, total: 6 },
        { n: 4, total: 10 },
        { n: 5, total: 15 },
      ]
    );
  });
});
