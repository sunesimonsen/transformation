const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const map = require("./map");
const filter = require("./filter");

describe("pipeline", () => {
  it("passes input through all the steps in the pipeline", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        filter(n => n % 2 === 0),
        map(n => n * n)
      ),
      "to yield items",
      [0, 4, 16]
    );
  });

  it("allows pipelines to be nested", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        pipeline(
          filter(n => n % 2 === 0),
          map(n => n * n)
        ),
        map(n => `${n} elephants`)
      ),
      "to yield items",
      ["0 elephants", "4 elephants", "16 elephants"]
    );
  });
});
