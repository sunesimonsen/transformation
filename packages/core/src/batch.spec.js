const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const batch = require("./batch");
const Group = require("./Group");

describe("batch", () => {
  it("creates groups with the given batch size", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5, 6), batch(2)),
      "to yield items",
      [
        Group.create({ key: "[0;1]", items: [0, 1] }),
        Group.create({ key: "[2;3]", items: [2, 3] }),
        Group.create({ key: "[4;5]", items: [4, 5] }),
        Group.create({ key: "[6;7]", items: [6] })
      ]
    );
  });
});
