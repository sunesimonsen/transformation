const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const {
  emitItems,
  interleave,
  pipeline,
  program
} = require("@transformation/core");
const { concat, lines } = require("@transformation/stream");
const exec = require("./exec");

describe("exec", () => {
  it("supports emitting chunks into the pipeline", async () => {
    await expect(
      pipeline(
        emitItems("Hello", "beautiful", "world!"),
        interleave("\n"),
        exec(`sed 's/^/> /g' | grep -v beautiful`),
        lines()
      ),
      "to yield items",
      ["> Hello", "> world!", ""]
    );
  });

  it("accepts input", async () => {
    await expect(
      pipeline(
        emitItems("Hello\nfantastic\nworld"),
        exec("grep -v fantastic"),
        concat()
      ),
      "to yield items",
      ["Hello\nworld\n"]
    );
  });

  it("fails if the command ends with a non-zero exit code", async () => {
    await expect(
      () => program(exec("ls non-existing-directory")),
      "to error",
      "ls: cannot access 'non-existing-directory': No such file or directory"
    );
  });

  it("fails if executing the command fails", async () => {
    await expect(
      () => program(exec("non-existing-command")),
      "to error",
      /non-existing-command/
    );
  });
});
