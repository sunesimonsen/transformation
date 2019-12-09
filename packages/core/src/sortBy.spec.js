const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const sortBy = require("./sortBy");

describe("sortBy", () => {
  describe("when given a fields with directions", () => {
    it("sort objects by the given field ascending", async () => {
      await expect(
        pipeline(
          emitItems(
            { name: "hat", price: 10 },
            { name: "cat", price: 100 },
            { name: "chat", price: 0 }
          ),
          sortBy("price")
        ),
        "to yield items",
        [
          { name: "chat", price: 0 },
          { name: "hat", price: 10 },
          { name: "cat", price: 100 }
        ]
      );
    });
  });

  describe("when given a fields and a direction", () => {
    it("sort objects by the given field in the specified direction", async () => {
      await expect(
        pipeline(
          emitItems(
            { name: "wat", price: 100 },
            { name: "hat", price: 10 },
            { name: "cat", price: 100 },
            { name: "chat", price: 0 },
            { name: "wat", price: 100 }
          ),
          sortBy("price:desc", "name:asc")
        ),
        "to yield items",
        [
          { name: "cat", price: 100 },
          { name: "wat", price: 100 },
          { name: "wat", price: 100 },
          { name: "hat", price: 10 },
          { name: "chat", price: 0 }
        ]
      );
    });
  });

  describe("when given a sorting function", () => {
    it("uses that do determine the direction", async () => {
      await expect(
        pipeline(
          emitItems(
            { name: "hat", price: 10 },
            { name: "cat", price: 100 },
            { name: "chat", price: 0 },
            { name: "wat", price: 100 }
          ),
          sortBy((a, b) => a.price - b.price, "name:asc")
        ),
        "to yield items",
        [
          { name: "chat", price: 0 },
          { name: "hat", price: 10 },
          { name: "cat", price: 100 },
          { name: "wat", price: 100 }
        ]
      );
    });
  });
});
