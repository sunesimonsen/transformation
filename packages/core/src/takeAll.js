const forEach = require("./forEach");
const program = require("./program");

const takeAll = async (...stepsOrChannels) => {
  const result = [];

  await program(
    ...stepsOrChannels,
    forEach((item) => {
      result.push(item);
    })
  );

  return result;
};

module.exports = takeAll;
