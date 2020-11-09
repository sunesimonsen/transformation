const expect = require("unexpected").clone().use(require("unexpected-steps"));
const path = require("path");
const fs = require("fs");
const fromFileStream = require("./fromFileStream");
const Chunk = require("./Chunk");

const testFile = path.join(__dirname, "..", "test", "song.txt");

describe("fromFileStream", () => {
  describe("when the given stream is not in object mode", () => {
    it("emits all of the chunks on the stream", async () => {
      await expect(
        fromFileStream(testFile, { encoding: "utf8" }),
        "to yield items",
        [new Chunk(fs.readFileSync(testFile, "utf8"), "utf8")]
      );
    });
  });

  describe("when the encoding of the given stream isn't defined", () => {
    it("emits all of the chunks on the stream as buffers", async () => {
      await expect(fromFileStream(testFile), "to yield items", [
        new Chunk(fs.readFileSync(testFile), null),
      ]);
    });
  });
});
