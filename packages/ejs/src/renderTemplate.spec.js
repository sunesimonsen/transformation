const expect = require("unexpected").clone().use(require("unexpected-steps"));

const {
  emitItems,
  pipeline,
  groupBy,
  toArray,
  sortBy,
} = require("@transformation/core");

const path = require("path");
const renderTemplate = require("./renderTemplate");

const stocksTemplatePath = path.join(__dirname, "..", "test", "stocks.ejs");
const stockArrayTemplatePath = path.join(
  __dirname,
  "..",
  "test",
  "stockArray.ejs"
);

describe("renderTemplate", () => {
  it("renders the given template for each item", async () => {
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
        renderTemplate(stocksTemplatePath)
      ),
      "to yield items",
      ["GOOG\n  1349\n  1351\n", "AAPL\n  274\n  275\n  279\n"]
    );
  });

  describe("when items is arrays", () => {
    it("forwards the items in an items field", async () => {
      await expect(
        pipeline(
          emitItems(
            { symbol: "GOOG", price: 1349 },
            { symbol: "AAPL", price: 274 },
            { symbol: "AAPL", price: 275 },
            { symbol: "GOOG", price: 1351 },
            { symbol: "AAPL", price: 279 }
          ),
          sortBy("symbol"),
          toArray(),
          renderTemplate(stockArrayTemplatePath)
        ),
        "to yield items",
        ["AAPL: 274\nAAPL: 275\nAAPL: 279\nGOOG: 1349\nGOOG: 1351\n"]
      );
    });
  });
});
