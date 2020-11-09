const expect = require("unexpected").clone().use(require("unexpected-steps"));
const path = require("path");
const fs = require("fs");
const { pipeline, emitItems } = require("@transformation/core");
const fromStream = require("./fromStream");
const lines = require("./lines");
const lineBoundaryRegex = require("./lineBoundaryRegex.js");

const testDir = path.join(__dirname, "..", "test");
const song = path.join(testDir, "song.txt");

const files = [
  "CRLF.txt",
  "empty-lines.txt",
  "empty.txt",
  "rfc.txt",
  "rfc_huge.txt",
  "song.txt",
];

describe("lines", () => {
  it("emits all lines from the incoming chunks", async () => {
    await expect(
      pipeline(fromStream(fs.createReadStream(song)), lines()),
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
        "",
      ]
    );
  });

  it("handles string items", async () => {
    await expect(
      pipeline(emitItems("one\ntwo\n", "three", "\nfour\nfive"), lines()),
      "to yield items",
      ["one", "two", "three", "four", "five"]
    );
  });

  for (const file of files) {
    it(`handles ${file}`, async () => {
      const filePath = path.join(testDir, file);

      await expect(
        pipeline(fromStream(fs.createReadStream(filePath)), lines()),
        "to yield items",
        fs.readFileSync(filePath, "utf8").split(lineBoundaryRegex)
      );
    });
  }
});
