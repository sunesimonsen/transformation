const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const withField = require("./withField");
const map = require("./map");

describe("withField", () => {
  it("transforms a specified field with the given steps", async () => {
    await expect(
      pipeline(
        emitItems(
          { symbol: "goog", price: 1349 },
          { symbol: "aapl", price: 274 },
          "this is not an object",
          null,
          { name: "no symbol" },
          { symbol: "aapl", price: 275 },
          { symbol: "goog", price: 1351 },
          { symbol: "aapl", price: 279 }
        ),
        withField(
          "symbol",
          map(symbol => symbol.toUpperCase())
        )
      ),
      "to yield items",
      [
        { symbol: "GOOG", price: 1349 },
        { symbol: "AAPL", price: 274 },
        "this is not an object",
        null,
        { name: "no symbol" },
        { symbol: "AAPL", price: 275 },
        { symbol: "GOOG", price: 1351 },
        { symbol: "AAPL", price: 279 }
      ]
    );
  });
});
