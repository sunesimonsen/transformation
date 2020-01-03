const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const transform = require("./transform");
const map = require("./map");

describe("transform", () => {
  it("transforms the each item, by running all of the returned pipelines", async () => {
    await expect(
      pipeline(
        emitItems(
          { symbol: "goog", price: 1349, currency: "USD" },
          { symbol: "aapl", price: 274, currency: "USD" },
          "this is not an object",
          null,
          { name: "no symbol", currency: "USD" },
          { symbol: "aapl", price: 275, currency: "USD" },
          { symbol: "goog", price: 1351, currency: "USD" },
          { symbol: "aapl", price: 279 }
        ),
        transform({
          symbol: map(symbol => symbol.toUpperCase()),
          price: map(price => `$${price}`)
        })
      ),
      "to yield items",
      [
        { symbol: "GOOG", price: "$1349", currency: "USD" },
        { symbol: "AAPL", price: "$274", currency: "USD" },
        "this is not an object",
        null,
        { name: "no symbol", currency: "USD" },
        { symbol: "AAPL", price: "$275", currency: "USD" },
        { symbol: "GOOG", price: "$1351", currency: "USD" },
        { symbol: "AAPL", price: "$279" }
      ]
    );
  });

  it("transforms nested structures", async () => {
    await expect(
      pipeline(
        emitItems(
          { symbol: "goog", price: { value: 1349, currency: "USD" } },
          { symbol: "aapl", price: { value: 274, currency: "USD" } },
          { symbol: "aapl", price: { value: 275, currency: "USD" } },
          { symbol: "goog", price: { value: 1351, currency: "USD" } },
          { symbol: "aapl", price: { value: 279, currency: "USD" } }
        ),
        transform({
          symbol: map(symbol => symbol.toUpperCase()),
          price: { value: map(price => price * 2) }
        })
      ),
      "to yield items",
      [
        { symbol: "GOOG", price: { value: 2698, currency: "USD" } },
        { symbol: "AAPL", price: { value: 548, currency: "USD" } },
        { symbol: "AAPL", price: { value: 550, currency: "USD" } },
        { symbol: "GOOG", price: { value: 2702, currency: "USD" } },
        { symbol: "AAPL", price: { value: 558, currency: "USD" } }
      ]
    );
  });
});
