const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const program = require("./program");
const forEach = require("./forEach");
const pipeline = require("./pipeline");
const map = require("./map");

describe("program", () => {
  it("returns a promise for running all the given steps", async () => {
    const items = [];

    await program(
      emitItems(0, 1, 2, 3, 4, 5),
      forEach((item) => items.push(item))
    );

    expect(items, "to equal", [0, 1, 2, 3, 4, 5]);
  });

  it("throws if a step yields an error", async () => {
    await expect(
      program(
        emitItems(0, 1, 2, 3, 4, 5),
        forEach((x) => {
          if (x === 3) {
            throw new Error("wat");
          }
        }),
        pipeline(map((x) => x + 1)),
        map((x) => x * x)
      ),
      "to be rejected with",
      new Error("wat")
    );
  });
});
