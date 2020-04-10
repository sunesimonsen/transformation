const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const when = require("./when");
const map = require("./map");
const delay = require("./delay");

describe("when", () => {
  it("uses the given pipeline when the predicate is true", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        when(
          n => n % 2 === 0,
          map(n => n * 2),
          map(n => `${n} transformed`)
        )
      ),
      "to yield items",
      [
        "0 transformed",
        1,
        "4 transformed",
        3,
        "8 transformed",
        5,
        "12 transformed",
        7,
        "16 transformed",
        9
      ]
    );
  });

  it("supports a hardcoded boolean as the predicate", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        when(
          true,
          map(n => n * n)
        ),
        when(
          false,
          map(n => `${n} transformed`)
        )
      ),
      "to yield items",
      [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
    );
  });

  it("supports async pipelines", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        when(
          n => n % 2 === 0,
          delay(10),
          map(n => `slow ${n}`)
        )
      ),
      "to yield items",
      ["slow 0", 1, "slow 2", 3, "slow 4", 5, "slow 6", 7, "slow 8", 9]
    );
  });
});
