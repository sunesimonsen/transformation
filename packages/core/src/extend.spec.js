const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const map = require("./map");
const extend = require("./extend");

describe("extend", () => {
  it("extends objects with new fields by executing the given pipelines", async () => {
    await expect(
      pipeline(
        emitItems(
          { firstName: "Jane", lastName: "Doe" },
          "Something else",
          null,
          { firstName: "John", lastName: "Doe" }
        ),
        extend({
          fullName: map(({ firstName, lastName }) => `${firstName} ${lastName}`)
        })
      ),
      "to yield items",
      [
        { firstName: "Jane", lastName: "Doe", fullName: "Jane Doe" },
        "Something else",
        null,
        { firstName: "John", lastName: "Doe", fullName: "John Doe" }
      ]
    );
  });

  it("accepts plain functions as an extension", async () => {
    await expect(
      pipeline(
        emitItems(
          { firstName: "Jane", lastName: "Doe" },
          "Something else",
          null,
          { firstName: "John", lastName: "Doe" }
        ),
        extend({
          fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`
        })
      ),
      "to yield items",
      [
        { firstName: "Jane", lastName: "Doe", fullName: "Jane Doe" },
        "Something else",
        null,
        { firstName: "John", lastName: "Doe", fullName: "John Doe" }
      ]
    );
  });

  it("accepts plain values", async () => {
    await expect(
      pipeline(
        emitItems(
          { firstName: "Jane", lastName: "Doe" },
          "Something else",
          null,
          { firstName: "John", lastName: "Doe", role: "nobody" }
        ),
        extend({
          role: "admin"
        })
      ),
      "to yield items",
      [
        { firstName: "Jane", lastName: "Doe", role: "admin" },
        "Something else",
        null,
        { firstName: "John", lastName: "Doe", role: "admin" }
      ]
    );
  });

  it("supports nesting", async () => {
    await expect(
      pipeline(
        emitItems(
          { firstName: "Jane", lastName: "Doe" },
          "Something else",
          null,
          { firstName: "John", lastName: "Doe", nesting: {} },
          { firstName: "Jonas", lastName: "Edo", nesting: "will be overriden" }
        ),
        extend({
          nesting: { supported: "YES" }
        })
      ),
      "to yield items",
      [
        { firstName: "Jane", lastName: "Doe", nesting: { supported: "YES" } },
        "Something else",
        null,
        { firstName: "John", lastName: "Doe", nesting: { supported: "YES" } },
        { firstName: "Jonas", lastName: "Edo", nesting: { supported: "YES" } }
      ]
    );
  });
});
