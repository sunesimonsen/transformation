const expect = require("unexpected").clone().use(require("unexpected-steps"));
const step = require("./step");
const pipeline = require("./pipeline");
const emitItems = require("./emitItems");

describe("step", () => {
  it("let's you define custom steps", async () => {
    const duplicate = () =>
      step(async ({ take, put, CLOSED }) => {
        while (true) {
          const value = await take();
          if (value === CLOSED) break;
          await put(value);
          await put(value);
        }
      });

    await expect(
      pipeline(emitItems(0, 1, 2, 3, 4, 5), duplicate()),
      "to yield items",
      [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
    );
  });
});
