const expect = require("unexpected").clone().use(require("unexpected-steps"));
const path = require("path");
const { emitItems, pipeline, map, sort } = require("@transformation/core");

const globEach = require("./globEach");

const testDir = path.join(__dirname, "..", "test");

describe("globEach", () => {
  describe("when incoming items is strings or arrays", () => {
    it("uses them as patterns", async () => {
      await expect(
        pipeline(
          emitItems("20*/report.txt", "2020/*.txt", [
            "2020/report.txt",
            "2021/report.txt",
          ]),
          globEach({ cwd: testDir }),
          sort()
        ),
        "to yield items",
        [
          "2020/report.txt",
          "2020/report.txt",
          "2020/report.txt",
          "2020/transactions.txt",
          "2021/report.txt",
          "2021/report.txt",
          "2022/report.txt",
        ]
      );
    });
  });

  describe("when given a string", () => {
    it("uses that as the pattern", async () => {
      await expect(
        pipeline(
          emitItems({ cwd: testDir }),
          globEach("20*/report.txt"),
          sort()
        ),
        "to yield items",
        ["2020/report.txt", "2021/report.txt", "2022/report.txt"]
      );
    });
  });

  it("merges incoming options with the given options", async () => {
    await expect(
      pipeline(
        emitItems("2020", "2021"),
        map((year) => ({ cwd: path.join(testDir, year) })),
        globEach({ pattern: "*.txt", absolute: true }),
        map((path) => path.replace(/.*\/transformation\//, "")),
        sort()
      ),
      "to yield items",
      [
        "packages/glob/test/2020/report.txt",
        "packages/glob/test/2020/transactions.txt",
        "packages/glob/test/2021/report.txt",
        "packages/glob/test/2021/transactions.txt",
      ]
    );
  });
});
