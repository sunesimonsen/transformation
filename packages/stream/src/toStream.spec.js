const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const fs = require("fs");
const { unlink, readFile } = fs.promises;
const path = require("path");
const fromStream = require("./fromStream");
const toStream = require("./toStream");
const lines = require("./lines");

const {
  emitItems,
  pipeline,
  map,
  interleave
} = require("@transformation/core");

const inputFile = path.join(__dirname, "..", "test", "song.txt");
const outputFile = path.join(__dirname, "..", "test", "song_output.txt");

describe("toStream", () => {
  beforeEach(async () => {
    await unlink(outputFile);
  });

  it("write data to the given stream as a side-effect", async () => {
    await expect(
      pipeline(
        fromStream(fs.createReadStream(inputFile)),
        toStream(fs.createWriteStream(outputFile)),
        lines()
      ),
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

  it("it allows you to write strings to the stream", async () => {
    await expect(
      pipeline(
        emitItems("one", "two", "three"),
        map((line, i) => `${i}) ${line}`),
        interleave("\n"),
        toStream(fs.createWriteStream(outputFile))
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
