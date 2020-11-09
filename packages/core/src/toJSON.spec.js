const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const toJSON = require("./toJSON");

describe("toJSON", () => {
  it("JSON stringify every items", async () => {
    await expect(
      pipeline(emitItems({ foo: "bar", year: 2000 }, 1, {}, true), toJSON()),
      "to yield items",
      ['{"foo":"bar","year":2000}', "1", "{}", "true"]
    );
  });

  it("allows you to pass in options", async () => {
    await expect(
      pipeline(
        emitItems({ foo: "bar", year: 2000 }, 1, {}, true),
        toJSON(null, 2)
      ),
      "to yield items",
      ['{\n  "foo": "bar",\n  "year": 2000\n}', "1", "{}", "true"]
    );
  });
});
