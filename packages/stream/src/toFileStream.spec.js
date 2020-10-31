const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const fs = require("fs");
const os = require("os");
const { mkdtemp, readFile } = fs.promises;
const path = require("path");
const fromFileStream = require("./fromFileStream");
const toFileStream = require("./toFileStream");
const lines = require("./lines");

const {
  emitItems,
  pipeline,
  map,
  interleave
} = require("@transformation/core");

const inputFile = path.join(__dirname, "..", "test", "song.txt");

const createOutputFile = async () =>
  path.join(await mkdtemp(path.join(os.tmpdir(), "output-")), "output.txt");

describe("toFileStream", () => {
  it("write data to the given file as a side-effect", async () => {
    const outputFile = await createOutputFile();

    await expect(
      pipeline(fromFileStream(inputFile), toFileStream(outputFile), lines()),
      "to yield items",
      [
        "One little sheep",
        "Two little birds",
        "Three little pigs",
        "Four little hedgehogs",
        "Five little hippos",
        "Six little frogs",
        "Seven little worms",
        "Eight little turtles",
        "Nine little lions",
        "Ten chickens",
        ""
      ]
    );

    expect(
      await readFile(outputFile, "utf8"),
      "to equal",
      await readFile(inputFile, "utf8")
    );
  });

  it("it allows you to write strings to the file", async () => {
    const outputFile = await createOutputFile();

    await expect(
      pipeline(
        emitItems("one", "two", "three"),
        map((line, i) => `${i}) ${line}`),
        interleave("\n"),
        toFileStream(outputFile)
      ),
      "to yield items",
      ["0) one", "\n", "1) two", "\n", "2) three"]
    );

    expect(
      await readFile(outputFile, "utf8"),
      "to equal",
      "0) one\n1) two\n2) three"
    );
  });
});
