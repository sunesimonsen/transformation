const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const delay = require("./delay");
const filter = require("./filter");
const fork = require("./fork");
const forEach = require("./forEach");
const map = require("./map");

describe("fork", () => {
  it("forks the pipeline", async () => {
    const forkedOutput = [];
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        fork(
          map((n) => n * n),
          forEach((n) => {
            forkedOutput.push(n);
          })
        ),
        filter((n) => n % 2 === 0)
      ),
      "to yield items",
      [0, 2, 4]
    );

    expect(forkedOutput, "to equal", [0, 1, 4, 9, 16, 25]);
  });

  it("waits for the forked pipeline", async () => {
    const forkedOutput = [];
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        fork(
          map((n) => n * n),
          delay(10),
          forEach((n) => {
            forkedOutput.push(n);
          })
        ),
        filter((n) => n % 2 === 0)
      ),
      "to yield items",
      [0, 2, 4]
    );

    expect(forkedOutput, "to equal", [0, 1, 4, 9, 16, 25]);
  });

  it("waits for the main pipeline", async () => {
    const forkedOutput = [];
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4, 5),
        fork(
          map((n) => n * n),
          forEach((n) => {
            forkedOutput.push(n);
          })
        ),
        delay(10),
        filter((n) => n % 2 === 0)
      ),
      "to yield items",
      [0, 2, 4]
    );

    expect(forkedOutput, "to equal", [0, 1, 4, 9, 16, 25]);
  });
});
