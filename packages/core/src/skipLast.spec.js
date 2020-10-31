const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const skipLast = require("./skipLast");

describe("skipLast(count)", () => {
  it("handles count=-1", async () => {
    await expect(
      pipeline(emitItems("foo", "bar", "baz"), skipLast(-1)),
      "to yield items",
      ["foo", "bar", "baz"]
    );
  });

  it("handles count=0", async () => {
    await expect(
      pipeline(emitItems("foo", "bar", "baz"), skipLast(0)),
      "to yield items",
      ["foo", "bar", "baz"]
    );
  });

  it("defaults to count=1", async () => {
    await expect(
      pipeline(emitItems("foo", "bar", "baz"), skipLast()),
      "to yield items",
      ["foo", "bar"]
    );
  });

  it("handles count=2", async () => {
    await expect(
      pipeline(emitItems("foo", "bar", "baz"), skipLast(2)),
      "to yield items",
      ["foo"]
    );
  });

  it("handles skipping everything", async () => {
    await expect(
      pipeline(emitItems("foo", "bar", "baz"), skipLast(5)),
      "to yield items",
      []
    );
  });
});
