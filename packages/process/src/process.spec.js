const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const path = require("path");
const { emitItems, pipeline, program, delay } = require("@transformation/core");
const { startProcess } = require("./process");

describe("process", () => {
  it("process data in a child process", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        startProcess(path.join(__dirname, "..", "test", "childProcess.js"))
      ),
      "to yield items",
      [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
    );
  });

  it("handles errors in the child process", async () => {
    await expect(
      program(
        emitItems(0, 1, 2, 3, 4, "wat", 5, 6, 7, 8, 9),
        startProcess(path.join(__dirname, "..", "test", "childProcess.js"))
      ),
      "to be rejected with",
      new TypeError(`Expected a number, got: wat`)
    );
  });

  it("handles delays in the processing", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        startProcess(
          path.join(__dirname, "..", "test", "delayedChildProcess.js")
        ),
        delay(5)
      ),
      "to yield items",
      [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
    );
  });
});
