const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const fromJSON = require("./fromJSON");

describe("fromJSON", () => {
  it("parses every items as JSON", async () => {
    await expect(
      pipeline(
        emitItems('{ "foo": "bar", "year": 2000 }', "1", "{}", "true"),
        fromJSON()
      ),
      "to yield items",
      [{ foo: "bar", year: 2000 }, 1, {}, true]
    );
  });
});
