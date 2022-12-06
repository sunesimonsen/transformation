const expect = require("unexpected").clone().use(require("unexpected-steps"));

const path = require("path");
const {
  emitItems,
  forEach,
  pipeline,
  program,
  skipLast,
  sort,
} = require("@transformation/core");
const { lines } = require("@transformation/stream");
const spawn = require("./spawn");
const testDir = path.join(__dirname, "..", "test", "data");

describe("spawn", () => {
  it("supports emitting chunks into the pipeline", async () => {
    await expect(
      pipeline(spawn("ls", [testDir]), lines(), skipLast()),
      "to yield items",
      ["0.txt", "1.txt", "2.txt"]
    );
  });

  it("supports sending chunks into command", async () => {
    await expect(
      pipeline(spawn("ls", [testDir]), spawn("grep", ["0"]), lines()),
      "to yield items",
      ["0.txt", ""]
    );
  });

  it("accepts input", async () => {
    await expect(
      pipeline(
        emitItems("Hello\nfantastic\nworld"),
        spawn("grep", ["-v", "fantastic"]),
        lines()
      ),
      "to yield items",
      ["Hello", "world", ""]
    );
  });

  it("supports zero byte delimited chunks", async () => {
    await expect(
      pipeline(
        spawn("find", [".", "-name", "*.txt", "-print0"], { cwd: testDir }),
        lines(0),
        skipLast(),
        sort()
      ),
      "to yield items",
      ["./0.txt", "./1.txt", "./2.txt"]
    );
  });

  it("can run as a program", async () => {
    const output = [];

    await program(
      spawn("find", [".", "-name", "*.txt", "-print0"], { cwd: testDir }),
      lines(0),
      skipLast(),
      sort(),
      forEach((item) => {
        output.push(item);
      })
    );

    expect(output, "to equal", ["./0.txt", "./1.txt", "./2.txt"]);
  });

  it("fails if the command ends with a non-zero exit code", async () => {
    await expect(
      () => program(spawn("ls", ["non-existing-directory"])),
      "to error",
      /No such file or directory/
    );
  });

  it("fails if spawning the command fails", async () => {
    await expect(
      () => program(spawn("non-existing-command")),
      "to error",
      "spawn non-existing-command ENOENT"
    );
  });
});
