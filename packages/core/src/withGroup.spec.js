const Group = require("./Group");
const emitItems = require("./emitItems");
const expect = require("unexpected").clone().use(require("unexpected-steps"));
const extend = require("./extend");
const forEach = require("./forEach");
const groupBy = require("./groupBy");
const map = require("./map");
const partition = require("./partition");
const pipeline = require("./pipeline");
const program = require("./program");
const withGroup = require("./withGroup");

describe("withGroup", () => {
  it("runs the given steps on the items of the incoming groups", async () => {
    await expect(
      pipeline(
        emitItems(
          { symbol: "GOOG", price: 1349 },
          { symbol: "AAPL", price: 274 },
          { symbol: "AAPL", price: 275 },
          { symbol: "GOOG", price: 1351 },
          { symbol: "AAPL", price: 279 }
        ),
        groupBy("symbol"),
        withGroup(
          extend({ label: ({ symbol, price }) => `${symbol}: ${price}` })
        )
      ),
      "to yield items",
      [
        Group.create({
          key: "GOOG",
          items: [
            { symbol: "GOOG", price: 1349, label: "GOOG: 1349" },
            { symbol: "GOOG", price: 1351, label: "GOOG: 1351" },
          ],
        }),
        Group.create({
          key: "AAPL",
          items: [
            { symbol: "AAPL", price: 274, label: "AAPL: 274" },
            { symbol: "AAPL", price: 275, label: "AAPL: 275" },
            { symbol: "AAPL", price: 279, label: "AAPL: 279" },
          ],
        }),
      ]
    );
  });

  it("stops processing if an error occurs", async () => {
    const processed = [];

    await expect(
      () =>
        program(
          emitItems(0, 1, 2, 3, 4, "bomb", 5, 6, 7, 8, 9, 10, 11, 12),
          partition(2),
          withGroup(
            map((n) => {
              if (n === "bomb") {
                throw new Error("Boom!");
              }
              return n;
            })
          ),
          forEach((group) => processed.push(group))
        ),
      "to error",
      "Boom!"
    );

    expect(processed, "to equal", [
      { key: "[0;1]", items: [0, 1] },
      { key: "[2;3]", items: [2, 3] },
    ]);
  });
});
