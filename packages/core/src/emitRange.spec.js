const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));
const emitRange = require("./emitRange");
const pipeline = require("./pipeline");
const program = require("./program");

describe("emitRange(start, end, step)", () => {
  describe("end=5", () => {
    it("start=0,end=5,step=1", async () => {
      await expect(pipeline(emitRange(5)), "to yield items", [0, 1, 2, 3, 4]);
    });
  });

  describe("end=-5", () => {
    it("start=0,end=-5,step=-1", async () => {
      await expect(pipeline(emitRange(-5)), "to yield items", [
        0,
        -1,
        -2,
        -3,
        -4
      ]);
    });
  });

  describe("start=2,end=7", () => {
    it("start=2,end=7,step=1", async () => {
      await expect(pipeline(emitRange(2, 7)), "to yield items", [
        2,
        3,
        4,
        5,
        6
      ]);
    });
  });

  describe("start=7,end=2", () => {
    it("start=7,end=2,step=-1", async () => {
      await expect(pipeline(emitRange(7, 2)), "to yield items", [
        7,
        6,
        5,
        4,
        3
      ]);
    });
  });

  it("allows you to provide a step: start=-5,end=5,step=2", async () => {
    await expect(pipeline(emitRange(-5, 5, 3)), "to yield items", [
      -5,
      -2,
      1,
      4
    ]);
  });

  it("allows you to provide a negative step: start=5,end=-5,step=-2", async () => {
    await expect(pipeline(emitRange(5, -5, -3)), "to yield items", [
      5,
      2,
      -1,
      -4
    ]);
  });

  it("throws if you give it a step of zero", async () => {
    await expect(
      () => program(emitRange(1, 4, 0)),
      "to error with",
      "A step of zero is not supported"
    );
  });
});
