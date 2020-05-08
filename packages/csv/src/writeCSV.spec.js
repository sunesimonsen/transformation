const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const path = require("path");

const {
  emitAll,
  emitItems,
  groupBy,
  program,
  takeAll
} = require("@transformation/core");

const readCSV = require("./readCSV");
const writeCSV = require("./writeCSV");

const testPath = path.join(__dirname, "..", "test");
const inputFilePath = path.join(testPath, "test.csv");
const outputFilePath = path.join(testPath, "testOutput.csv");

describe("writeCSV", () => {
  it("writes all the items into a CSV file", async () => {
    const items = await takeAll(readCSV(inputFilePath));
    await program(emitAll(items), writeCSV(outputFilePath));
    const writtenItems = await takeAll(readCSV(outputFilePath));

    expect(writtenItems, "to equal", items);
  });

  describe("when given a function as the path", () => {
    it("calculates the output file path based on the records", async () => {
      const items = await takeAll(readCSV(inputFilePath));
      await program(
        emitAll(items),
        writeCSV(({ type }) => path.join(testPath, `${type}.csv`))
      );

      const writtenItems = await takeAll(
        readCSV(path.join(testPath, "earthquake.csv"))
      );

      expect(writtenItems, "to equal", items);
    });
  });

  describe("when a given groups", () => {
    it("writes the items of the groups", async () => {
      await program(
        emitItems(
          { symbol: "GOOG", price: 1349 },
          { symbol: "AAPL", price: 274 },
          { symbol: "AAPL", price: 275 },
          { symbol: "GOOG", price: 1351 },
          { symbol: "AAPL", price: 279 }
        ),
        groupBy("symbol"),
        writeCSV(({ key }) => path.join(testPath, `stocks-${key}.csv`))
      );

      const writtenItems = await takeAll(
        readCSV(path.join(testPath, "stocks-GOOG.csv"))
      );

      expect(writtenItems, "to equal", [
        { symbol: "GOOG", price: "1349" },
        { symbol: "GOOG", price: "1351" }
      ]);
    });
  });
});
