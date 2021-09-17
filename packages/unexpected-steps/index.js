const { chan, take, CLOSED } = require("medium");

const takeAll = async (step) => {
  const result = [];
  const errors = chan();
  const input = chan();
  const output = step.body(input, errors);

  let error = null;
  take(errors).then((e) => {
    error = e;
  });

  while (true) {
    const value = await take(output);
    if (error) throw error;
    if (value === CLOSED) break;
    result.push(value);
  }

  return result;
};

module.exports = (expect) => {
  expect.addType({
    base: "object",
    name: "step",
    identify: (value) => value && value.type === "step",
  });
  expect.addAssertion(
    "<step> to yield items <array>",
    async (expect, step, expected) => {
      const result = await takeAll(step);
      expect.subjectOutput = (output) => {
        output.jsKeyword("channel").text("(").appendInspected(result).text(")");
      };
      return expect(result, "to equal", expected);
    }
  );
};
