const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const groupBy = require("./groupBy");
const Group = require("./Group");

describe("groupBy", () => {
  describe("when given a function", () => {
    it("groups the items by the key return by the function", async () => {
      await expect(
        pipeline(
          emitItems(0, 1, 2, 3, 4, 5, 6),
          groupBy(value => (value % 2 === 0 ? "even" : "odd"))
        ),
        "to yield items",
        [
          Group.create({ key: "even", items: [0, 2, 4, 6] }),
          Group.create({ key: "odd", items: [1, 3, 5] })
        ]
      );
    });
  });

  describe("when given a field", () => {
    it("uses the given field to group by", async () => {
      await expect(
        pipeline(
          emitItems(
            { symbol: "GOOG", price: 1349 },
            { symbol: "AAPL", price: 274 },
            { symbol: "AAPL", price: 275 },
            { symbol: "GOOG", price: 1351 },
            { symbol: "AAPL", price: 279 }
          ),
          groupBy("symbol")
        ),
        "to yield items",
        [
          Group.create({
            key: "GOOG",
            items: [
              { symbol: "GOOG", price: 1349 },
              { symbol: "GOOG", price: 1351 }
            ]
          }),
          Group.create({
            key: "AAPL",
            items: [
              { symbol: "AAPL", price: 274 },
              { symbol: "AAPL", price: 275 },
              { symbol: "AAPL", price: 279 }
            ]
          })
        ]
      );
    });
  });
});
