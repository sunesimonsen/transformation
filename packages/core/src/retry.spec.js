const expect = require("unexpected").clone().use(require("unexpected-steps"));
const sinon = require("sinon");
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const forEach = require("./forEach");
const retry = require("./retry");
const map = require("./map");
const program = require("./program");

let count = 0;
const flakyMapper = (n) => {
  if (count++ < n) {
    throw new Error("Boom!");
  } else {
    count = 0;
    return n;
  }
};

describe("retry", () => {
  it("retries the given steps when an error occurs", async () => {
    await expect(
      pipeline(
        emitItems(0, 1, 2, 3, 4),
        retry({ max: 5, delay: 3 }, map(flakyMapper))
      ),
      "to yield items",
      [0, 1, 2, 3, 4]
    );
  });

  it("fails if the given steps isn't succeeds within the limits", async () => {
    await expect(
      () =>
        program(
          emitItems(0, 1, 2, 3, 4),
          retry({ max: 4, delay: 3 }, map(flakyMapper))
        ),
      "to error",
      "Boom!"
    );
  });

  describe("backoff", () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    describe("default (exponential)", () => {
      it("add a liniar delay to each retry", async () => {
        const result = [];

        program(
          emitItems(0, 1, 2, 3, 4),
          retry(map(flakyMapper)),
          forEach((v) => result.push(v))
        );

        await clock.runAllAsync();

        expect(
          clock.now,
          "to equal",
          100 + 100 + 200 + 100 + 200 + 400 + 100 + 200 + 400 + 800
        );

        expect(result, "to equal", [0, 1, 2, 3, 4]);
      });
    });

    describe("liniar", () => {
      it("add a liniar delay to each retry", async () => {
        const result = [];

        program(
          emitItems(0, 1, 2, 3, 4),
          retry({ max: 5, delay: 3, strategy: "linear" }, map(flakyMapper)),
          forEach((v) => result.push(v))
        );

        await clock.runAllAsync();

        expect(clock.now, "to equal", 3 * 10);

        expect(result, "to equal", [0, 1, 2, 3, 4]);
      });
    });

    describe("exponential", () => {
      it("add a liniar delay to each retry", async () => {
        const result = [];

        program(
          emitItems(0, 1, 2, 3, 4),
          retry({ max: 5, delay: 3 }, map(flakyMapper)),
          forEach((v) => result.push(v))
        );

        await clock.runAllAsync();

        expect(clock.now, "to equal", 3 + 3 + 6 + 3 + 6 + 12 + 3 + 6 + 12 + 24);

        expect(result, "to equal", [0, 1, 2, 3, 4]);
      });
    });
  });
});
