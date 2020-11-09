const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const delay = require("./delay");

describe("delay", () => {
  it("waits the given milliseconds before forwarding each value", async () => {
    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5), delay(1)),
      "to yield items",
      [0, 1, 2, 3, 4, 5]
    );
  });
});
