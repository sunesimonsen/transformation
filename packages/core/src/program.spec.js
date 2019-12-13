const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const program = require("./program");
const forEach = require("./forEach");

describe("program", () => {
  it("returns a promise for running all the given steps", async () => {
    const items = [];

    await program(
      emitItems(0, 1, 2, 3, 4, 5),
      forEach(item => items.push(item))
    );

    expect(items, "to equal", [0, 1, 2, 3, 4, 5]);
  });
});
