const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitAll = require("./emitAll");
const { sleep } = require("medium");

describe("emitAll", () => {
  it("emits all items from an array", async () => {
    await expect(emitAll([0, 1, 2, 3, 4, 5]), "to yield items", [
      0,
      1,
      2,
      3,
      4,
      5
    ]);
  });

  it("emits all items from an iterable", async () => {
    function* iterator() {
      for (let i = 0; i < 6; i++) {
        yield i;
      }
    }

    await expect(emitAll(iterator()), "to yield items", [0, 1, 2, 3, 4, 5]);
  });

  it("emits all items from an async iterable", async () => {
    async function* asyncIterator() {
      for (let i = 0; i < 6; i++) {
        await sleep(1);
        yield i;
      }
    }

    await expect(emitAll(asyncIterator()), "to yield items", [
      0,
      1,
      2,
      3,
      4,
      5
    ]);
  });

  it("supports emitting items from multiple generators", async () => {
    async function* asyncIterable() {
      for (let i = 0; i < 3; i++) {
        await sleep(1);
        yield i;
      }
    }

    await expect(emitAll(asyncIterable(), [3, 4, 5]), "to yield items", [
      0,
      1,
      2,
      3,
      4,
      5
    ]);
  });
});
