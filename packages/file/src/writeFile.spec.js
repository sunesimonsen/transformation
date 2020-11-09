const expect = require("unexpected").clone().use(require("unexpected-steps"));

const fs = require("fs");
const path = require("path");
const os = require("os");
const { mkdtemp } = fs.promises;

const { emitItems, pipeline } = require("@transformation/core");

const createOutputDir = async () =>
  path.join(await mkdtemp(path.join(os.tmpdir(), "output-")));

const writeFile = require("./writeFile");

describe("writeFile", () => {
  it("writes all items to the given path as a side-effect", async () => {
    const outputDir = await createOutputDir();
    const outputPath = path.join(outputDir, "output.txt");

    await expect(
      pipeline(emitItems("Hello", "world"), writeFile(outputPath)),
      "to yield items",
      ["Hello", "world"]
    );

    await expect(fs.readFileSync(outputPath, "utf8"), "to equal", "world");
  });
});
