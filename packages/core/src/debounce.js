const step = require("./step");

const debounce = (ms) =>
  step(async ({ take, put, CLOSED }) => {
    let timer;
    let putValue;

    while (true) {
      const value = await take();
      if (value === CLOSED) {
        if (putValue) await putValue();
        break;
      }

      putValue = () => put(value);
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await putValue();
      }, ms);
    }
  });

module.exports = debounce;
