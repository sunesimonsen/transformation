# @transformation/csv

A package for reading and writing CSV files.

<!-- toc -->

- [readCSV](#readcsv)
- [writeCSV](#writecsv)

<!-- tocstop -->

## readCSV

Streams the rows of a CSV file using [csv-parser](https://www.npmjs.com/package/csv-parser) and emits objects.

```js
const { readCSV } = require("transformation/csv");
```

```js
await expect(readCSV(csvFilePath), "to yield items", [
  {
    time: "2015-12-22T18:45:11.000Z",
    latitude: "59.9988",
    longitude: "-152.7191"
  },
  {
    time: "2015-12-22T18:38:34.000Z",
    latitude: "62.9616",
    longitude: "-148.7532"
  },
  {
    time: "2015-12-22T18:38:01.820Z",
    latitude: "19.2129993",
    longitude: "-155.4179993"
  },
  {
    time: "2015-12-22T18:38:00.000Z",
    latitude: "63.7218",
    longitude: "-147.083"
  },
  {
    time: "2015-12-22T18:28:57.000Z",
    latitude: "64.0769",
    longitude: "-148.8226"
  },
  {
    time: "2015-12-22T18:25:40.000Z",
    latitude: "61.4715",
    longitude: "-150.7697"
  }
]);
```

You can provide options to the parser the following way. It just forwards the options to [csv-parser](https://www.npmjs.com/package/csv-parser#options).

```js
readCSV(csvFilePath, {
  maxRowBytes: 10
});
```

## writeCSV

Writes objects to one or more CSV files using [csv-writer](https://www.npmjs.com/package/csv-writer).

```js
const { writeCSV } = require("transformation/csv");
```

Simplest case is just to write objects into a single file.

```js
await program(
  emitItems(
    { symbol: "GOOG", price: 1349 },
    { symbol: "AAPL", price: 274 },
    { symbol: "AAPL", price: 275 },
    { symbol: "GOOG", price: 1351 },
    { symbol: "AAPL", price: 279 }
  ),
  writeCSV("stocks.csv")
);
```

You can also route the objects to multiple files.

```js
await program(
  emitItems(
    { symbol: "GOOG", price: 1349 },
    { symbol: "AAPL", price: 274 },
    { symbol: "AAPL", price: 275 },
    { symbol: "GOOG", price: 1351 },
    { symbol: "AAPL", price: 279 }
  ),
  writeCSV(({ symbol }) => path.join(testPath, `stocks-${symbol}.csv`))
);
```

You can provide options to the parser the following way. It just forwards the options to [csv-writer](https://www.npmjs.com/package/csv-writer#createobjectcsvwriterparams).

```js
await program(
  emitItems(
    { symbol: "GOOG", price: 1349 },
    { symbol: "AAPL", price: 274 },
    { symbol: "AAPL", price: 275 },
    { symbol: "GOOG", price: 1351 },
    { symbol: "AAPL", price: 279 }
  ),
  writeCSV("stocks.csv", {
    headers: [
      { id: "symbol", title: "Symbol" },
      { id: "price", title: "Price $" }
    ]
  })
);
```

Notice it is usually easier to just map the keys of the objects using the [map](../core/Readme.md#map) transform.
