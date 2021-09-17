const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const emitRange = require("./emitRange");
const forEach = require("./forEach");
const map = require("./map");
const pipeline = require("./pipeline");
const program = require("./program");
const toArray = require("./toArray");

describe("map", () => {
  it("transforms each item with the given mapper", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        map((n) => n * n)
      ),
      "to yield items",
      [0, 1, 4, 9, 16, 25]
    );
  });

  it("provides the index of the current item to the mapper function", async () => {
    await expect(
      pipeline(
        emitItems("zero", "one", "two", "three"),
        map((n, i) => `${i}: ${n}`)
      ),
      "to yield items",
      ["0: zero", "1: one", "2: two", "3: three"]
    );
  });

  describe("when the mapper returns a step", () => {
    it("emits all of the values generated from the step", async () => {
      await expect(
        pipeline(
          emitItems(0, 1, 2, 3, 4),
          map((n) => pipeline(emitRange(n), toArray()))
        ),
        "to yield items",
        [[], [0], [0, 1], [0, 1, 2], [0, 1, 2, 3]]
      );
    });
  });

  it("stops proceesing when an error occurs", async () => {
    const processed = [];

    await expect(
      () =>
        program(
          emitItems(0, 1, 2, 3, 4, "bomb", 5, 6, 7, 8, 9),
          map((n) => {
            if (n === "bomb") {
              throw new Error("Boom!");
            }
            return n;
          }),
          forEach((item) => processed.push(item))
        ),
      "to error",
      "Boom!"
    );

    expect(processed, "to equal", [0, 1, 2, 3, 4]);
  });

  it("stops proceesing when an error occurs inside of a sub-pipeline", async () => {
    const processed = [];

    await expect(
      () =>
        program(
          emitItems(0, 1, 2, 3, 4, "bomb", 5, 6, 7, 8, 9),
          map((n) =>
            pipeline(
              emitItems(n),
              map((n) => {
                if (n === "bomb") {
                  throw new Error("Boom!");
                }
                return n;
              })
            )
          ),
          forEach((item) => processed.push(item))
        ),
      "to error",
      "Boom!"
    );

    expect(processed, "to equal", [0, 1, 2, 3, 4, 5]);
  });
});
