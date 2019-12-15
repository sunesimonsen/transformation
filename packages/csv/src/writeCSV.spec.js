const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const path = require("path");
const { program, takeAll, emitItems } = require("@transformation/core");
const readCSV = require("./readCSV");
const writeCSV = require("./writeCSV");

const testPath = path.join(__dirname, "..", "test");
const inputFilePath = path.join(testPath, "test.csv");
const outputFilePath = path.join(testPath, "testOutput.csv");

describe("writeCSV", () => {
  let items;
  beforeEach(async () => {
    items = await takeAll(readCSV(inputFilePath));
  });

  it("writes all the items into a CSV file", async () => {
    await program(emitItems(...items), writeCSV(outputFilePath));
    const writtenItems = await takeAll(readCSV(outputFilePath));

    expect(writtenItems, "to equal", items);
  });

  describe("when given a function as the path", () => {
    it("calculates the output file path based on the first record", async () => {
      await program(
        emitItems(...items),
        writeCSV(({ type }) => path.join(testPath, `${type}.csv`))
      );

      const writtenItems = await takeAll(
        readCSV(path.join(testPath, "earthquake.csv"))
      );

      expect(writtenItems, "to equal", items);
    });
  });
});
