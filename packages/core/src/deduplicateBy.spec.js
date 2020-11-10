const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const deduplicateBy = require("./deduplicateBy");

describe("deduplicateBy", () => {
  describe("when given a field", () => {
    it("uses the given field to decide if an item is a duplicate", async () => {
      await expect(
        pipeline(
          emitItems(
            { id: 0, name: "foo", count: 0 },
            { id: 0, name: "foo", count: 1 },
            { id: 1, name: "bar", count: 2 },
            { id: 2, name: "baz", count: 3 },
            { id: 2, name: "baz", count: 4 },
            { id: 3, name: "qux", count: 5 },
            { id: 2, name: "baz", count: 6 },
            { id: 0, name: "foo", count: 7 }
          ),
          deduplicateBy("id")
        ),
        "to yield items",
        [
          { id: 0, name: "foo", count: 1 },
          { id: 1, name: "bar", count: 2 },
          { id: 2, name: "baz", count: 3 },
          { id: 3, name: "qux", count: 5 },
          { id: 2, name: "baz", count: 6 },
          { id: 0, name: "foo", count: 7 },
        ]
      );
    });
  });

  describe("when given a selector function", () => {
    it("uses the selected value to decide if an item is a duplicate", async () => {
      await expect(
        pipeline(
          emitItems(
            { id: 0, name: "foo", count: 0 },
            { id: 0, name: "foo", count: 1 },
            { id: 1, name: "bar", count: 2 },
            { id: 2, name: "baz", count: 3 },
            { id: 2, name: "baz", count: 4 },
            { id: 3, name: "qux", count: 5 },
            { id: 2, name: "baz", count: 6 },
            { id: 0, name: "foo", count: 7 }
          ),
          deduplicateBy(({ name }) => name)
        ),
        "to yield items",
        [
          { id: 0, name: "foo", count: 1 },
          { id: 1, name: "bar", count: 2 },
          { id: 2, name: "baz", count: 3 },
          { id: 3, name: "qux", count: 5 },
          { id: 2, name: "baz", count: 6 },
          { id: 0, name: "foo", count: 7 },
        ]
      );
    });
  });
});
