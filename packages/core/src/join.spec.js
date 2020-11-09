const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const join = require("./join");

describe("join", () => {
  it("joins all items in the pipeline into a string", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5), join()),
      "to yield items",
      ["0,1,2,3,4,5"]
    );
  });

  describe("when given a separator", () => {
    it("separates the joins items with the separator", async () => {
      await expect(
        pipeline(emitItems(0, 1, 2, 3, 4, 5), join(" - ")),
        "to yield items",
        ["0 - 1 - 2 - 3 - 4 - 5"]
      );
    });
  });

  describe("when the pipeline contains objects", () => {
    it("stringify them before joining", async () => {
      class Person {
        constructor(name) {
          this.name = name;
        }

        toString() {
          return `Person(${this.name})`;
        }
      }

      await expect(
        pipeline(
          emitItems(new Person("Jane Doe"), new Person("John Doe")),
          join(", ")
        ),
        "to yield items",
        ["Person(Jane Doe), Person(John Doe)"]
      );
    });
  });
});
