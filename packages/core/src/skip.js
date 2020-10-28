const step = require("./step");

const skip = count => {
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
