const { chan, take, CLOSED } = require("medium");

const takeAll = async step => {
  const result = [];
  const output = step(chan());

  while (true) {
    const value = await take(output);
    if (value === CLOSED) break;
    result.push(value);
  }

  return result;
};

module.exports = expect => {
  expect.addAssertion(
    "<function> to yield items <array>",
    async (expect, step, expected) => {
      const result = await takeAll(step);
      expect.subjectOutput = output => {
        output
          .jsKeyword("channel")
          .text("(")
          .appendInspected(result)
          .text(")");
      };
      return expect(result, "to equal", expected);
    }
  );

  expect.addAssertion(
    "<function> to yield items satisfying <assertion>",
    async (expect, step) => {
      const result = await takeAll(step);
      expect.subjectOutput = output => {
        output
          .jsKeyword("channel")
          .text("(")
          .appendInspected(result)
          .text(")");
      };
      return expect.shift(result);
    }
  );
};
