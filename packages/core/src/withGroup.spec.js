const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const groupBy = require("./groupBy");
const extend = require("./extend");
const withGroup = require("./withGroup");
const Group = require("./Group");

describe("withGroup", () => {
  it("runs the given steps on the items of the incoming groups", async () => {
    await expect(
      pipeline(
        emitItems(
          { symbol: "GOOG", price: 1349 },
          { symbol: "AAPL", price: 274 },
          { symbol: "AAPL", price: 275 },
          { symbol: "GOOG", price: 1351 },
          { symbol: "AAPL", price: 279 }
        ),
        groupBy("symbol"),
        withGroup(
          extend({ label: ({ symbol, price }) => `${symbol}: ${price}` })
        )
      ),
      "to yield items",
      [
        Group.create({
          key: "GOOG",
          items: [
            { symbol: "GOOG", price: 1349, label: "GOOG: 1349" },
            { symbol: "GOOG", price: 1351, label: "GOOG: 1351" },
          ],
        }),
        Group.create({
          key: "AAPL",
          items: [
            { symbol: "AAPL", price: 274, label: "AAPL: 274" },
            { symbol: "AAPL", price: 275, label: "AAPL: 275" },
            { symbol: "AAPL", price: 279, label: "AAPL: 279" },
          ],
        }),
      ]
    );
  });
});
