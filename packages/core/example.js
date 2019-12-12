const pipeline = require("@transformation/pipeline");

module.exports = pipeline(
  readCSV("stocks.csv"),
  map(async row => {
    const response = await fetch(
      `https://api.exchangeratesapi.io/${row.date}?base=USD`
    );

    const { rates } = await response.json();

    return {
      ...row,
      dkkRate: rates.DKK
    };
  }),
  map(row => ({ ...row, value: row.price * row.quantity })),
  map(row => ({ ...row, dkkValue: row.value * row.dkkRate })),
  map(row => ({ ...row, dkkValue: row.value * row.dkkRate })),
  accumulate(
    (row, previous) => ({
      ...row,
      totalPrice: previous.totalPrice + row.price
    }),
    { totalPrice: 0 }
  ),
  sortBy("date"),
  tapTable()
);
