const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

const {
  emitItems,
  program,
  groupBy,
  toArray,
  sortBy
} = require("@transformation/core");

const path = require("path");
const writeTemplate = require("./writeTemplate");

const testPath = path.join(__dirname, "..", "test");
const stocksTemplatePath = path.join(testPath, "stocks.ejs");
const stocksOutputPath = path.join(testPath, "stocks.txt");
const stockArrayTemplatePath = path.join(
  __dirname,
  "..",
  "test",
  "stockArray.ejs"
);

describe("writeTemplate", () => {
  it("renders the given template for each item", async () => {
    await program(
      emitItems(
        { symbol: "GOOG", price: 1349 },
        { symbol: "AAPL", price: 274 },
        { symbol: "AAPL", price: 275 },
        { symbol: "GOOG", price: 1351 },
        { symbol: "AAPL", price: 279 }
      ),
      sortBy("symbol"),
      toArray(),
      writeTemplate(stockArrayTemplatePath, stocksOutputPath)
    );

    const output = await readFile(stocksOutputPath, "utf-8");

    expect(
      output,
      "to equal",
      "AAPL: 274\nAAPL: 275\nAAPL: 279\nGOOG: 1349\nGOOG: 1351\n"
    );
  });

  describe("when given a function as the path", () => {
    it("calculates the output file path based on the records", async () => {
      await program(
        emitItems(
          { symbol: "GOOG", price: 1349 },
          { symbol: "AAPL", price: 274 },
          { symbol: "AAPL", price: 275 },
          { symbol: "GOOG", price: 1351 },
          { symbol: "AAPL", price: 279 }
        ),
        groupBy("symbol"),
        writeTemplate(stocksTemplatePath, ({ key }) =>
          path.join(testPath, `stocks-${key}.txt`)
        )
      );

      const output = await readFile(
        path.join(testPath, `stocks-GOOG.txt`),
        "utf-8"
      );

      expect(output, "to equal", "GOOG\n  1349\n  1351\n");
    });
  });
});