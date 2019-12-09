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
  accumulate({
    totalPrice: (row, totalPrice) => row.price + totalPrice
  }),
  sortBy("date"),
  tapTable({
    value: "sum",
    capitalGain: "sum",
    price: ["min", "max", "average"]
  })
);
