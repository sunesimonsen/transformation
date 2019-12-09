const forEach = require("./forEach");
const program = require("./pipeline");

const takeAll = async stepOrChannel => {
  const result = [];

  await program(
    stepOrChannel,
    forEach(item => {
      result.push(item);
    })
  );

  return result;
};

module.exports = takeAll;
