const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const partition = require("./partition");
const Group = require("./Group");

describe("partition", () => {
  it("creates groups with the given partition size", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5, 6), partition(2)),
      "to yield items",
      [
        Group.create({ key: "[0;1]", items: [0, 1] }),
        Group.create({ key: "[2;3]", items: [2, 3] }),
        Group.create({ key: "[4;5]", items: [4, 5] }),
        Group.create({ key: "[6;7]", items: [6] }),
      ]
    );
  });

  it("handles the case where a partiion isn't full", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5, 6), partition(2)),
      "to yield items",
      [
        Group.create({ key: "[0;1]", items: [0, 1] }),
        Group.create({ key: "[2;3]", items: [2, 3] }),
        Group.create({ key: "[4;5]", items: [4, 5] }),
        Group.create({ key: "[6;7]", items: [6] }),
      ]
    );
  });

  it("handles the case where all partiions is full", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5), partition(2)),
      "to yield items",
      [
        Group.create({ key: "[0;1]", items: [0, 1] }),
        Group.create({ key: "[2;3]", items: [2, 3] }),
        Group.create({ key: "[4;5]", items: [4, 5] }),
      ]
    );
  });
});
