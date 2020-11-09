const expect = require("unexpected").clone().use(require("unexpected-steps"));
const emitItems = require("./emitItems");
const program = require("./program");
const pipeline = require("./pipeline");
const tap = require("./tap");

class TestLogger {
  constructor() {
    this.entries = [];
  }

  log(value) {
    this.entries.push(value);
  }
}

const originalConsole = console;

describe("tap", () => {
  beforeEach(() => {
    global.console = new TestLogger();
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  describe("when called without any arguments", () => {
    it("prints the items to the console", async () => {
      await program(emitItems(0, 1, 2, 3, 4, 5), tap());

      await expect(console.entries, "to equal", [0, 1, 2, 3, 4, 5]);
    });
  });

  describe("when given a selector field", () => {
    it("prints the selected output to the logger", async () => {
      await program(
        emitItems(
          { name: "hat", price: 10 },
          { name: "cat", price: 100 },
          { name: "chat", price: 0 }
        ),
        tap("name")
      );

      await expect(console.entries, "to equal", ["hat", "cat", "chat"]);
    });
  });

  describe("when given a selector function", () => {
    it("prints the selected output to the logger", async () => {
      await program(
        emitItems(0, 1, 2, 3, 4, 5),
        tap((n) => `Item: ${n}`)
      );

      await expect(console.entries, "to equal", [
        "Item: 0",
        "Item: 1",
        "Item: 2",
        "Item: 3",
        "Item: 4",
        "Item: 5",
      ]);
    });
  });

  it("forwards items unchanged", async () => {
    await expect(
      pipeline(
        emitItems(
          { name: "hat", price: 10 },
          { name: "cat", price: 100 },
          { name: "chat", price: 0 }
        ),
        tap("name")
      ),
      "to yield items",
      [
        { name: "hat", price: 10 },
        { name: "cat", price: 100 },
        { name: "chat", price: 0 },
      ]
    );
  });
});
