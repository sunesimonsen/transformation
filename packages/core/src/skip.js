const step = require("./step");

const skip = count => {
  if (count <= 0) {
    return false;
  }

  return step(async ({ take, put, CLOSED }) => {
    let i = 0;
    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      if (count <= i) {
        await put(value);
      }

      i++;
    }
  });
};

module.exports = skip;
