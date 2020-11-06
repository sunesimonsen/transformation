const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const program = require("./program");
const forEach = require("./forEach");
const cleanup = require("./cleanup");

describe("cleanup", () => {
  it("executes a side-effect when the step is done", async () => {
    const items = [];

    await program(
      emitItems(0, 1, 2, 3),
      forEach(item => items.push(item)),
      cleanup(() => items.push(4)),
      cleanup(() => items.push(5))
    );

    expect(items, "to equal", [0, 1, 2, 3, 4, 5]);
  });

  it("cleanup steps run even when an error happens in the pipeline", async () => {
    const items = [];

    try {
      await program(
        emitItems(0, 1, 2, 3),
        forEach((item, i) => {
          if (i === 2) {
            throw new Error("wat");
          }
        }),
        forEach(item => items.push(item)),
        cleanup(() => items.push(4)),
        cleanup(() => items.push(5))
      );
    } catch (e) {
      // ignore
    }

    expect(items, "to equal", [0, 1, 4, 5]);
  });
});
