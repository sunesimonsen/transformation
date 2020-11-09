const expect = require("unexpected").clone().use(require("unexpected-steps"));
const path = require("path");
const fs = require("fs");
const readEachFile = require("./readEachFile");
const testDir = path.join(__dirname, "..", "test");
const songPath = path.join(testDir, "song.txt");
const æøåPath = path.join(testDir, "æøå.txt");
const { emitItems, pipeline } = require("@transformation/core");

describe("readEachFile", () => {
  it("reads the content of the given file into the pipeline", async () => {
    await expect(
      pipeline(emitItems(songPath, æøåPath), readEachFile("utf8")),
      "to yield items",
      [
        {
          path: songPath,
          data: fs.readFileSync(songPath, "utf8"),
        },
        {
          path: æøåPath,
          data: fs.readFileSync(æøåPath, "utf8"),
        },
      ]
    );
  });
});
