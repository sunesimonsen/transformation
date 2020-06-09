const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const path = require("path");
const { pipeline, sort } = require("@transformation/core");

const glob = require("./glob");

const testDir = path.join(__dirname, "..", "test");

describe("glob", () => {
  it("emits paths", async () => {
    await expect(
      pipeline(glob({ cwd: testDir, pattern: "2020/*.txt" }), sort()),
      "to yield items",
      ["2020/report.txt", "2020/transactions.txt"]
    );
  });

  it("supports just giving a pattern", async () => {
    await expect(
      pipeline(glob("test/20*/report.txt"), sort()),
      "to yield items",
      ["test/2020/report.txt", "test/2021/report.txt", "test/2022/report.txt"]
    );
  });
});
