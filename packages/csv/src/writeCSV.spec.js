const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const path = require("path");
const { program, takeAll, emitItems } = require("@transformation/core");
const readCSV = require("./readCSV");
const writeCSV = require("./writeCSV");

const inputFilePath = path.join(__dirname, "..", "test", "test.csv");
const outputFilePath = path.join(__dirname, "..", "test", "testOutput.csv");

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
});
