const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const fs = require("fs");
const path = require("path");
const os = require("os");
const { mkdtemp } = fs.promises;

const { emitItems, pipeline, map } = require("@transformation/core");

const createOutputDir = async () =>
  path.join(await mkdtemp(path.join(os.tmpdir(), "output-")));

const writeEachFile = require("./writeEachFile");

describe("writeEachFile", () => {
  describe("when given a function", () => {
    it("calculates the output file path based on the items in the pipeline", async () => {
      const outputDir = await createOutputDir();

      await expect(
        pipeline(
          emitItems("Hello", "world"),
          writeEachFile(value => path.join(outputDir, `${value}.txt`))
        ),
        "to yield items",
        ["Hello", "world"]
      );

      await expect(
        fs.readFileSync(path.join(outputDir, "Hello.txt"), "utf8"),
        "to equal",
        "Hello"
      );

      await expect(
        fs.readFileSync(path.join(outputDir, "world.txt"), "utf8"),
        "to equal",
        "world"
      );
    });
  });

  describe("when given no arguments", () => {
    it("reads the path, data and options from the incoming items", async () => {
      const outputDir = await createOutputDir();

      await expect(
        pipeline(
          emitItems(
            { name: "1", data: "one", options: { encoding: "utf8" } },
            { name: "2", data: "two", options: "utf8" },
            { name: "3", data: "three" }
          ),
          map(({ name, ...other }) => ({
            ...other,
            path: path.join(outputDir, `${name}.txt`)
          })),
          writeEachFile()
        ),
        "to yield items",
        [
          {
            path: path.join(outputDir, "1.txt"),
            data: "one",
            options: { encoding: "utf8" }
          },
          { path: path.join(outputDir, "2.txt"), data: "two", options: "utf8" },
          { path: path.join(outputDir, "3.txt"), data: "three" }
        ]
      );

      await expect(
        fs.readFileSync(path.join(outputDir, "1.txt"), "utf8"),
        "to equal",
        "one"
      );

      await expect(
        fs.readFileSync(path.join(outputDir, "2.txt"), "utf8"),
        "to equal",
        "two"
      );

      await expect(
        fs.readFileSync(path.join(outputDir, "3.txt"), "utf8"),
        "to equal",
        "three"
      );
    });
  });
});
