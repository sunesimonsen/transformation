const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const delay = require("./delay");
const debounce = require("./debounce");

describe("debounce", () => {
  it("debounces incoming items by the given amount of time", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 50, 3, 4, 50, 5, 6),
        (ms) => pipeline(emitItems(ms), delay(ms)),
        debounce(40)
      ),
      "to yield items",
      [2, 4, 6]
    );
  });
});
