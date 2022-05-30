const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const uniqBy = require("./uniqBy");

describe("uniq", () => {
  describe("when given a field", () => {
    it("uses the given field to decide if an item is unique", async () => {
      await expect(
        pipeline(
          emitItems(
            { id: 0, name: "foo", count: 0 },
            { id: 1, name: "bar", count: 1 },
            { id: 2, name: "baz", count: 2 },
            { id: 0, name: "foo", count: 3 },
            { id: 3, name: "qux", count: 4 },
            { id: 2, name: "baz", count: 5 }
          ),
          uniqBy("id")
        ),
        "to yield items",
        [
          { id: 0, name: "foo", count: 0 },
          { id: 1, name: "bar", count: 1 },
          { id: 2, name: "baz", count: 2 },
          { id: 3, name: "qux", count: 4 },
        ]
      );
    });
  });

  describe("when given a selector function", () => {
    it("uses the selected value to decide if an item is unique", async () => {
      await expect(
        pipeline(
          emitItems(
            { id: 0, name: "foo", count: 0 },
            { id: 1, name: "bar", count: 1 },
            { id: 2, name: "baz", count: 2 },
            { id: 0, name: "foo", count: 3 },
            { id: 3, name: "qux", count: 4 },
            { id: 2, name: "baz", count: 5 }
          ),
          uniqBy(({ name }) => name)
        ),
        "to yield items",
        [
          { id: 0, name: "foo", count: 0 },
          { id: 1, name: "bar", count: 1 },
          { id: 2, name: "baz", count: 2 },
          { id: 3, name: "qux", count: 4 },
        ]
      );
    });
  });

  it("doesn't reset state for each invocation of the step", async () => {
    const uniqByName = uniqBy(({ name }) => name);

    await expect(
      pipeline(
        emitItems(
          { id: 0, name: "foo", count: 0 },
          { id: 1, name: "bar", count: 1 },
          { id: 2, name: "baz", count: 2 },
          { id: 0, name: "foo", count: 3 },
          { id: 3, name: "qux", count: 4 },
          { id: 2, name: "baz", count: 5 }
        ),
        uniqByName
      ),
      "to yield items",
      [
        { id: 0, name: "foo", count: 0 },
        { id: 1, name: "bar", count: 1 },
        { id: 2, name: "baz", count: 2 },
        { id: 3, name: "qux", count: 4 },
      ]
    );

    await expect(
      pipeline(
        emitItems(
          { id: 0, name: "foo", count: 0 },
          { id: 1, name: "bar", count: 1 },
          { id: 4, name: "quux", count: 4 }
        ),
        uniqByName
      ),
      "to yield items",
      [{ id: 4, name: "quux", count: 4 }]
    );
  });
});
