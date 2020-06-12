const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const keyBy = require("./keyBy");

describe("keyBy", () => {
  describe("when given a string", () => {
    it("indexes each item into to an object by the given key", async () => {
      await expect(
        pipeline(
          emitItems(
            { id: 0, name: "foo" },
            { id: 1, name: "bar" },
            { id: 2, name: "baz" },
            { id: 3, name: "qux" }
          ),
          keyBy("id")
        ),
        "to yield items",
        [
          {
            0: { id: 0, name: "foo" },
            1: { id: 1, name: "bar" },
            2: { id: 2, name: "baz" },
            3: { id: 3, name: "qux" }
          }
        ]
      );
    });
  });

  describe("when given a selector function", () => {
    it("indexes each item into to an object by the selected keys", async () => {
      await expect(
        pipeline(
          emitItems(
            { id: 0, name: "foo" },
            { id: 1, name: "bar" },
            { id: 2, name: "baz" },
            { id: 3, name: "qux" }
          ),
          keyBy(({ name }) => name)
        ),
        "to yield items",
        [
          {
            foo: { id: 0, name: "foo" },
            bar: { id: 1, name: "bar" },
            baz: { id: 2, name: "baz" },
            qux: { id: 3, name: "qux" }
          }
        ]
      );
    });
  });
});
