const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const transform = require("./transform");
const map = require("./map");
const sort = require("./sort");
const splitIterable = require("./splitIterable");
const toArray = require("./toArray");

describe("transform", () => {
  it("transforms the each item, by running all of the returned pipelines", async () => {
    await expect(
      pipeline(
        emitItems(
          { symbol: "goog", price: 1349, currency: "USD" },
          { symbol: "aapl", price: 274, currency: "USD" },
          "this is not an object",
          null,
          {
            name: "no symbol",
            price: 666,
            currency: "USD",
            nesting: { supported: "yes" }
          },
          { symbol: "aapl", price: 275, currency: "USD" },
          { symbol: "goog", price: 1351, currency: "USD" },
          { symbol: "aapl", price: 279 }
        ),
        transform({
          symbol: map(symbol => symbol.toUpperCase()),
          price: map(price => `$${price}`),
          nesting: {
            supported: map(symbol => symbol.toUpperCase())
          }
        })
      ),
      "to yield items",
      [
        { symbol: "GOOG", price: "$1349", currency: "USD" },
        { symbol: "AAPL", price: "$274", currency: "USD" },
        "this is not an object",
        null,
        {
          name: "no symbol",
          price: "$666",
          currency: "USD",
          nesting: { supported: "YES" }
        },
        { symbol: "AAPL", price: "$275", currency: "USD" },
        { symbol: "GOOG", price: "$1351", currency: "USD" },
        { symbol: "AAPL", price: "$279" }
      ]
    );
  });

  it("supports transforming with complex pipelines", async () => {
    await expect(
      pipeline(
        emitItems(
          {
            dependencies: [
              "@zendesk/knowledge-context",
              "@zendesk/guide-client-chrome",
              "@zendesk/guide-client-webpack-config",
              "@zendesk/knowledge-utils",
              "@zendesk/knowledge-components",
              "@zendesk/knowledge-http-client"
            ]
          },
          {
            dependencies: [
              "@zendesk/guide-client-analytics",
              "@zendesk/knowledge-components",
              "@zendesk/guide-client-chrome",
              "@zendesk/knowledge-context",
              "@zendesk/guide-client-webpack-config",
              "@zendesk/knowledge-utils"
            ]
          }
        ),
        transform({
          dependencies: pipeline(splitIterable(), sort(), toArray())
        })
      ),
      "to yield items",
      [
        {
          dependencies: [
            "@zendesk/guide-client-chrome",
            "@zendesk/guide-client-webpack-config",
            "@zendesk/knowledge-components",
            "@zendesk/knowledge-context",
            "@zendesk/knowledge-http-client",
            "@zendesk/knowledge-utils"
          ]
        },
        {
          dependencies: [
            "@zendesk/guide-client-analytics",
            "@zendesk/guide-client-chrome",
            "@zendesk/guide-client-webpack-config",
            "@zendesk/knowledge-components",
            "@zendesk/knowledge-context",
            "@zendesk/knowledge-utils"
          ]
        }
      ]
    );
  });

  it("transforms nested structures", async () => {
    await expect(
      pipeline(
        emitItems(
          { symbol: "goog", price: { value: 1349, currency: "USD" } },
          { symbol: "aapl", price: { value: 274, currency: "USD" } },
          { symbol: "aapl", price: { value: 275, currency: "USD" } },
          { symbol: "goog", price: { value: 1351, currency: "USD" } },
          { symbol: "aapl", price: { value: 279, currency: "USD" } }
        ),
        transform({
          symbol: map(symbol => symbol.toUpperCase()),
          price: { value: map(price => price * 2) }
        })
      ),
      "to yield items",
      [
        { symbol: "GOOG", price: { value: 2698, currency: "USD" } },
        { symbol: "AAPL", price: { value: 548, currency: "USD" } },
        { symbol: "AAPL", price: { value: 550, currency: "USD" } },
        { symbol: "GOOG", price: { value: 2702, currency: "USD" } },
        { symbol: "AAPL", price: { value: 558, currency: "USD" } }
      ]
    );
  });
});
