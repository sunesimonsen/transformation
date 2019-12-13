const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const groupBy = require("./groupBy");
const map = require("./map");
const withGroup = require("./withGroup");

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
          map(row => ({
            ...row,
            label: `${row.symbol}: ${row.price}`
          }))
        )
      ),
      "to yield items",
      [
        {
          GOOG: [
            { symbol: "GOOG", price: 1349, label: "GOOG: 1349" },
            { symbol: "GOOG", price: 1351, label: "GOOG: 1351" }
          ],
          AAPL: [
            { symbol: "AAPL", price: 274, label: "AAPL: 274" },
            { symbol: "AAPL", price: 275, label: "AAPL: 275" },
            { symbol: "AAPL", price: 279, label: "AAPL: 279" }
          ]
        }
      ]
    );
  });
});
