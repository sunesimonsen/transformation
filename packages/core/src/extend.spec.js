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
});
