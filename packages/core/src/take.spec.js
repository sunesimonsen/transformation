const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitRepeat = require("./emitRepeat");
const pipeline = require("./pipeline");
const take = require("./take");

describe("take(count)", () => {
  it("handles count=-1", async () => {
    await expect(
      pipeline(emitRepeat(["foo", "baz", "baz"]), take(-1)),
      "to yield items",
      []
    );
  });

  it("handles count=0", async () => {
    await expect(
      pipeline(emitRepeat(["foo", "baz", "baz"]), take(0)),
      "to yield items",
      []
    );
  });

  it("handles count=7", async () => {
    await expect(
      pipeline(emitRepeat(["foo", "baz", "baz"]), take(7)),
      "to yield items",
      ["foo", "baz", "baz", "foo", "baz", "baz", "foo"]
    );
  });

  it("handles taking more items than the pipeline contains", async () => {
    await expect(
      pipeline(emitRepeat(["foo", "baz", "baz"], 3), take(7)),
      "to yield items",
      ["foo", "baz", "baz"]
    );
  });
});
