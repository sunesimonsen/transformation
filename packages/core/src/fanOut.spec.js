const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const fanOut = require("./fanOut");
const map = require("./map");
const { sleep } = require("medium");

describe("fanOut", () => {
  it("runs the given step in parallel", async () => {
    await expect(
      pipeline(
        emitItems(5, 4, 3, 2, 1, 0),
        fanOut(
          map(async n => {
            await sleep(n);
            return n + 1;
          }),
          4
        )
      ),
      "to yield items satisfying to contain",
      1,
      2,
      3,
      4,
      5,
      6
    );
  });
});
