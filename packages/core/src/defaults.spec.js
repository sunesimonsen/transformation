const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const defaults = require("./defaults");

describe("defaults", () => {
  it("extends any objects with default values", async () => {
    await expect(
      pipeline(
        emitItems(
          true,
          false,
          null,
          { value: "one" },
          2,
          { stuff: "three" },
          4
        ),
        defaults({
          type: "object",
          metadata: {},
        })
      ),
      "to yield items",
      [
        true,
        false,
        null,
        { type: "object", metadata: {}, value: "one" },
        2,
        { type: "object", metadata: {}, stuff: "three" },
        4,
      ]
    );
  });
});
