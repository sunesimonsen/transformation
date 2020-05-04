const expect = require("unexpected");
const takeAll = require("./takeAll");
const map = require("./map");
const emitItems = require("./emitItems");

describe("takeAll", () => {
  it("takes all items from a given pipeline", async () => {
    const items = await takeAll(
      emitItems(0, 1, 2, 3, 4, 5),
      map(x => x * x)
    );

    expect(items, "to equal", [0, 1, 4, 9, 16, 25]);
  });
});
