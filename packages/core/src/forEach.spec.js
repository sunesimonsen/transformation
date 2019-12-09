const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const forEach = require("./forEach");
const program = require("./program");

describe("forEach", () => {
  it("executes a side-effect for each value", async () => {
    const items = [];

    await program(
      emitItems(0, 1, 2, 3, 4, 5),
      forEach(item => items.push(item))
    );

    expect(items, "to equal", [0, 1, 2, 3, 4, 5]);
  });
});
