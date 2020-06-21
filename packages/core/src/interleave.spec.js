const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const interleave = require("./interleave");

describe("interleave", () => {
  describe("when only one separator", () => {
    it("interleaves the separator between the items in the pipeline", async () => {
      await expect(
        pipeline(emitItems("0", "1", "2", "3", "4", "5"), interleave(",")),
        "to yield items",
        ["0", ",", "1", ",", "2", ",", "3", ",", "4", ",", "5"]
      );
    });
  });

  describe("when given multiple separators", () => {
    it("interleaves the separators between the items in the pipeline", async () => {
      await expect(
        pipeline(
          emitItems("0", "1", "2", "3", "4", "5"),
          interleave(",", "-", "|")
        ),
        "to yield items",
        ["0", ",", "1", "-", "2", "|", "3", ",", "4", "-", "5"]
      );
    });
  });
});
