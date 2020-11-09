const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const frequencies = require("./frequencies");

describe("frequencies", () => {
  describe("when given no arguments", () => {
    it("counts items", async () => {
      await expect(
        pipeline(
          emitItems("foo", "bar", "baz", "qux", "qux", "baz", "qux", "foo"),
          frequencies()
        ),
        "to yield items",
        [{ foo: 2, bar: 1, baz: 2, qux: 3 }]
      );
    });
  });

  describe("when given a field", () => {
    it("counts items by the given field", async () => {
      await expect(
        pipeline(
          emitItems(
            { id: 0, name: "foo" },
            { id: 1, name: "bar" },
            { id: 2, name: "baz" },
            { id: 3, name: "qux" },
            { id: 4, name: "qux" },
            { id: 5, name: "baz" },
            { id: 6, name: "qux" },
            { id: 7, name: "foo" }
          ),
          frequencies("name")
        ),
        "to yield items",
        [{ foo: 2, bar: 1, baz: 2, qux: 3 }]
      );
    });
  });

  describe("when given a selector function", () => {
    it("counts items by the selected value", async () => {
      await expect(
        pipeline(
          emitItems(
            { id: 0, name: "foo" },
            { id: 1, name: "bar" },
            { id: 2, name: "baz" },
            { id: 3, name: "qux" },
            { id: 4, name: "qux" },
            { id: 5, name: "baz" },
            { id: 6, name: "qux" },
            { id: 7, name: "foo" }
          ),
          frequencies(({ name }) => name[0])
        ),
        "to yield items",
        [{ f: 2, b: 3, q: 3 }]
      );
    });
  });
});
