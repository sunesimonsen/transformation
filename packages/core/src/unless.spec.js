const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const unless = require("./unless");
const map = require("./map");
const delay = require("./delay");

describe("unless", () => {
  it("uses the given pipeline when the predicate is false", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        unless(
          n => n % 2 === 0,
          map(n => n * 2),
          map(n => `${n} transformed`)
        )
      ),
      "to yield items satisfying to contain",
      0,
      "2 transformed",
      2,
      "6 transformed",
      4,
      "10 transformed",
      6,
      "14 transformed",
      8,
      "18 transformed"
    );
  });

  it("supports async pipelines", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        unless(
          n => n % 2 === 0,
          delay(10),
          map(n => `slow ${n}`)
        )
      ),
      "to yield items satisfying to contain",
      0,
      "slow 1",
      2,
      "slow 3",
      4,
      "slow 5",
      6,
      "slow 7",
      8,
      "slow 9"
    );
  });
});
