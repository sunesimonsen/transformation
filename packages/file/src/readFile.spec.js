const expect = require("unexpected").clone().use(require("unexpected-steps"));
const { pipeline, splitIterable } = require("@transformation/core");

const path = require("path");
const readFile = require("./readFile");
const testDir = path.join(__dirname, "..", "test");
const songPath = path.join(testDir, "song.txt");

describe("readFile", () => {
  it("reads the content of the given file into the pipeline", async () => {
    await expect(
      pipeline(
        readFile(songPath, "utf8"),
        (data) => data.trim().split("\n"),
        splitIterable()
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
      ]
    );
  });
});
