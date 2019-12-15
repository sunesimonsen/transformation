const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const batchBy = require("./batchBy");
const { createGroup } = require("./Group");

describe("batchBy", () => {
  describe("when given a function", () => {
    it("creates a new group when key return by the function changes", async () => {
      await expect(
        pipeline(
          emitItems(
            { symbol: "GOOG", price: 1349 },
            { symbol: "AAPL", price: 274 },
            { symbol: "AAPL", price: 275 },
            { symbol: "GOOG", price: 1351 },
            { symbol: "AAPL", price: 279 }
          ),
          batchBy(({ symbol }) => symbol)
        ),
        "to yield items",
        [
          createGroup({
            key: "GOOG",
            items: [{ symbol: "GOOG", price: 1349 }]
          }),
          createGroup({
            key: "AAPL",
            items: [
              { symbol: "AAPL", price: 274 },
              { symbol: "AAPL", price: 275 }
            ]
          }),
          createGroup({
            key: "GOOG",
            items: [{ symbol: "GOOG", price: 1351 }]
          }),
          createGroup({
            key: "AAPL",
            items: [{ symbol: "AAPL", price: 279 }]
          })
        ]
      );
    });
  });

  describe("when given a field", () => {
    it("creates a new group when that field changes", async () => {
      await expect(
        pipeline(
          emitItems(
            { symbol: "GOOG", price: 1349 },
            { symbol: "AAPL", price: 274 },
            { symbol: "AAPL", price: 275 },
            { symbol: "GOOG", price: 1351 },
            { symbol: "AAPL", price: 279 }
          ),
          batchBy("symbol")
        ),
        "to yield items",
        [
          createGroup({
            key: "GOOG",
            items: [{ symbol: "GOOG", price: 1349 }]
          }),
          createGroup({
            key: "AAPL",
            items: [
              { symbol: "AAPL", price: 274 },
              { symbol: "AAPL", price: 275 }
            ]
          }),
          createGroup({
            key: "GOOG",
            items: [{ symbol: "GOOG", price: 1351 }]
          }),
          createGroup({
            key: "AAPL",
            items: [{ symbol: "AAPL", price: 279 }]
          })
        ]
      );
    });
  });
});
