const expect = require("unexpected").clone().use(require("unexpected-steps"));

const { sleep } = require("medium");
const emitItems = require("./emitItems");
const pipeline = require("./pipeline");
const splitIterable = require("./splitIterable");

describe("splitIterable", () => {
  it("re-emits all items in the iterables as individual items", async () => {
    function* iterator() {
      for (let i = 6; i < 10; i++) {
        yield i;
      }
    }

    async function* asyncIterator() {
      for (let i = 10; i < 15; i++) {
        await sleep(1);
        yield i;
      }
    }

    await expect(
      pipeline(
        emitItems(
          0,
          [1, 2],
          [3, 4, 5],
          iterator(),
          asyncIterator(),
          "It doesn't split strings"
        ),
        splitIterable()
      ),
      "to yield items",
      [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        "It doesn't split strings",
      ]
    );
  });
});
