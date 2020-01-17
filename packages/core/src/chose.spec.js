const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const chose = require("./chose");
const map = require("./map");
const filter = require("./filter");
const delay = require("./delay");

describe("chose", () => {
  it("choses the given pipeline based on the selection", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        chose(n => (n % 2 === 0 ? "even" : "odd"), {
          even: map(n => n * 2),
          odd: map(n => n * -2)
        })
      ),
      "to yield items satisfying to contain",
      0,
      -2,
      4,
      -6,
      8,
      -10,
      12,
      -14,
      16,
      -18
    );
  });

  it("allows a hardcoded field", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        chose("even", {
          even: map(n => n * 2),
          odd: map(n => n * -2)
        })
      ),
      "to yield items satisfying to contain",
      0,
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18
    );
  });

  describe("when the choice doesn't exist", () => {
    it("doesn't transform the item", async () => {
      await expect(
        pipeline(
          emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
          chose(n => (n % 2 === 0 ? "even" : "odd"), {
            even: map(n => n * 2)
          })
        ),
        "to yield items satisfying to contain",
        0,
        1,
        4,
        3,
        8,
        5,
        12,
        7,
        16,
        9
      );
    });
  });

  it("supports async pipelines", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        chose(n => (n % 2 === 0 ? "slow" : "fast"), {
          slow: pipeline(
            delay(10),
            map(n => `slow ${n}`)
          )
        })
      ),
      "to yield items satisfying to contain",
      "slow 0",
      1,
      "slow 2",
      3,
      "slow 4",
      5,
      "slow 6",
      7,
      "slow 8",
      9
    );
  });

  it("handles a pipeline that filters all items out", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        chose(n => (n % 2 === 0 ? "even" : "odd"), {
          even: map(n => n * 2),
          odd: filter(n => false)
        })
      ),
      "to yield items satisfying to contain",
      0,
      4,
      8,
      12,
      16
    );
  });
});
