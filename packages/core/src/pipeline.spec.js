const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const splitIterable = require("./splitIterable");
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

  it("allows steps to be resolved async", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        new Promise(resolve =>
          setTimeout(() => {
            resolve(filter(n => n % 2 === 0));
          }, 0)
        ),
        map(n => n * n)
      ),
      "to yield items",
      [0, 4, 16]
    );
  });

  it("considers functions as flatMap", async () => {
    await expect(
      pipeline(
        emitItems("  \nHere is some text\n  with multiple lines\n   "),
        s => s.trim(),
        s => s.split(/\n/),
        splitIterable(),
        s => s.trim(),
        (s, i) => s.replace(/^/, `${i + 1}) `)
      ),
      "to yield items",
      ["1) Here is some text", "2) with multiple lines"]
    );
  });

  it("skips steps that is falsy", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        pipeline(
          filter(n => n % 2 === 0),
          false && map(n => n * n)
        ),
        map(n => `${n} elephants`)
      ),
      "to yield items",
      ["0 elephants", "2 elephants", "4 elephants"]
    );
  });
});
