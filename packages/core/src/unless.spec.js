const expect = require("unexpected").clone().use(require("unexpected-steps"));
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
          (n) => n % 2 === 0,
          map((n) => n * 2),
          map((n) => `${n} transformed`)
        )
      ),
      "to yield items",
      [
        0,
        "2 transformed",
        2,
        "6 transformed",
        4,
        "10 transformed",
        6,
        "14 transformed",
        8,
        "18 transformed",
      ]
    );
  });

  it("supports a hardcoded boolean as the predicate", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        unless(
          true,
          map((n) => n * n)
        ),
        unless(
          false,
          map((n) => `${n} transformed`)
        )
      ),
      "to yield items",
      [
        "0 transformed",
        "1 transformed",
        "2 transformed",
        "3 transformed",
        "4 transformed",
        "5 transformed",
        "6 transformed",
        "7 transformed",
        "8 transformed",
        "9 transformed",
      ]
    );
  });

  it("supports async pipelines", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        unless(
          (n) => n % 2 === 0,
          delay(10),
          map((n) => `slow ${n}`)
        )
      ),
      "to yield items",
      [0, "slow 1", 2, "slow 3", 4, "slow 5", 6, "slow 7", 8, "slow 9"]
    );
  });
});
