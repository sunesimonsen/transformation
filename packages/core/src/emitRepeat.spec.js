const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitRepeat = require("./emitRepeat");
const pipeline = require("./pipeline");
const take = require("./take");

describe("emitRepeat(items, limit)", () => {
  it("doesn't emit anything if the limit is negative", async () => {
    await expect(emitRepeat("hello", -1), "to yield items", []);
  });

  it("doesn't emit anything if the limit is zero", async () => {
    await expect(emitRepeat("hello", 0), "to yield items", []);
  });

  it("handles items='hello', limit=1", async () => {
    await expect(emitRepeat("hello", 1), "to yield items", ["hello"]);
  });

  it("handles items='hello', limit=3", async () => {
    await expect(emitRepeat("hello", 3), "to yield items", [
      "hello",
      "hello",
      "hello",
    ]);
  });

  it("handles items=['foo', 'bar', 'baz'], limit=7", async () => {
    await expect(emitRepeat(["foo", "bar", "baz"], 7), "to yield items", [
      "foo",
      "bar",
      "baz",
      "foo",
      "bar",
      "baz",
      "foo",
    ]);
  });

  it("handles items=['foo', 'bar', 'baz']", async () => {
    await expect(
      pipeline(emitRepeat(["foo", "bar", "baz"]), take(7)),
      "to yield items",
      ["foo", "bar", "baz", "foo", "bar", "baz", "foo"]
    );
  });
});
