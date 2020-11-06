const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const program = require("./program");
const forEach = require("./forEach");
const setup = require("./setup");

describe("setup", () => {
  it("executes a side-effect when the step is initialize", async () => {
    const items = [];

    await program(
      emitItems(2, 3, 4, 5),
      setup(() => items.push(0)),
      forEach(item => items.push(item)),
      setup(() => items.push(1))
    );

    expect(items, "to equal", [0, 1, 2, 3, 4, 5]);
  });
});
