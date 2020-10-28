const step = require("./step");

const take = count => {
  return step(async ({ take, put, CLOSED }) => {
    let i = 0;
    while (true) {
      const value = await take();
      if (value === CLOSED || count <= i) break;
      await put(value);

      i++;
    }
  });
};

module.exports = take;
