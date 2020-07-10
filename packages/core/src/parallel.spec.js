const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const program = require("./program");
const parallel = require("./parallel");
const map = require("./map");
const forEach = require("./forEach");
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

  describe("when the step fails", () => {
    it("closes the pipeline", async () => {
      let processed = [];
      await expect(
        () =>
          program(
            emitItems(0, 1, 2, "bomb", 3, 4, 5),
            parallel(
              pipeline(
                forEach(async n => {
                  if (n === "bomb") {
                    throw new Error("Boom!");
                  }
                  await sleep(n * 10);
                })
              )
            ),
            forEach(n => {
              processed.push(n);
            })
          ),
        "to error",
        "Boom!"
      );

      expect(processed, "to contain", 0, 1, 2);
    });
  });
});
