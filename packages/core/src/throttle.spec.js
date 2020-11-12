const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const delay = require("./delay");
const throttle = require("./throttle");

describe("throttle", () => {
  it("throttles incoming items by the given amount of time", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 50, 3, 4, 50, 5, 6),
        (ms) => pipeline(emitItems(ms), delay(ms)),
        throttle(40)
      ),
      "to yield items",
      [0, 50, 50]
    );
  });
});
