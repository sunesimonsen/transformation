const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitRepeat = require("./emitRepeat");
const pipeline = require("./pipeline");
const take = require("./take");
const skip = require("./skip");

describe("skip(count)", () => {
  it("handles count=-1", async () => {
    await expect(
      pipeline(emitRepeat(["foo", "bar", "baz"]), skip(-1), take(3)),
      "to yield items",
      ["foo", "bar", "baz"]
    );
  });

  it("handles count=0", async () => {
    await expect(
      pipeline(emitRepeat(["foo", "bar", "baz"]), skip(0), take(3)),
      "to yield items",
      ["foo", "bar", "baz"]
    );
  });

  it("handles count=2", async () => {
    await expect(
      pipeline(emitRepeat(["foo", "bar", "baz"]), skip(2), take(3)),
      "to yield items",
      ["baz", "foo", "bar"]
    );
  });

  it("handles skipping everything", async () => {
    await expect(
      pipeline(emitRepeat(["foo", "bar", "baz"], 3), skip(5)),
      "to yield items",
      []
    );
  });
});
