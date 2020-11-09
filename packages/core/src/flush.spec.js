const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const flush = require("./flush");
const forEach = require("./forEach");

describe("flush", () => {
  it("flushes everything on the given channel", async () => {
    const items = [];

    await flush(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        forEach((item) => items.push(item))
      )
    );

    expect(items, "to equal", [0, 1, 2, 3, 4, 5]);
  });
});
