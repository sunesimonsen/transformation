const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const parallel = require("./parallel");
const map = require("./map");
const { sleep } = require("medium");

describe("parallel", () => {
  describe("without a concurrency count", () => {
    it("runs the given step in parallel", async () => {
      await expect(
        pipeline(
          emitItems(5, 4, 3, 2, 1, 0),
          parallel(
            map(async n => {
              await sleep(n);
              return n + 1;
            })
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

  describe("with a given concurrency count", () => {
    it("runs the given step in parallel with the specified concurrency", async () => {
      await expect(
        pipeline(
          emitItems(5, 4, 3, 2, 1, 0),
          parallel(
            map(async n => {
              await sleep(n);
              return n + 1;
            }),
            2
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
});
