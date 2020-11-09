const expect = require("unexpected").clone().use(require("unexpected-steps"));
const path = require("path");
const fs = require("fs");
const fromStream = require("./fromStream");
const Chunk = require("./Chunk");
const byline = require("byline");

const testFile = path.join(__dirname, "..", "test", "song.txt");

describe("fromStream", () => {
  describe("when the given stream is in object mode", () => {
    it("emits all of the objects on the stream", async () => {
      await expect(
        fromStream(byline(fs.createReadStream(testFile), { encoding: "utf8" })),
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
        ]
      );
    });
  });

  describe("when the given stream is not in object mode", () => {
    it("emits all of the chunks on the stream", async () => {
      await expect(
        fromStream(fs.createReadStream(testFile, { encoding: "utf8" })),
        "to yield items",
        [new Chunk(fs.readFileSync(testFile, "utf8"), "utf8")]
      );
    });
  });

  describe("when the encoding of the given stream isn't defined", () => {
    it("emits all of the chunks on the stream as buffers", async () => {
      await expect(
        fromStream(fs.createReadStream(testFile)),
        "to yield items",
        [new Chunk(fs.readFileSync(testFile), null)]
      );
    });
  });

  describe("when given multiple streams", () => {
    it("emits the items from all of the streams", async () => {
      await expect(
        fromStream(
          fs.createReadStream(testFile),
          fs.createReadStream(testFile)
        ),
        "to yield items",
        [
          new Chunk(fs.readFileSync(testFile), null),
          new Chunk(fs.readFileSync(testFile), null),
        ]
      );
    });
  });
});
