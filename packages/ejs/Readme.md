# @transformation/ejs

A package for rendering [EJS](https://ejs.co/) templates.

## renderTemplate

Renders an EJS template for each item in the pipeline.

```js
const { renderTemplate } = require("@transformation/ejs");
```

Let say we want to render stock items with a custom template. Let's start out by defining the template in a file called `stocks.ejs`.

```ejs
<%-key%>
<% for(let { price } of items) { -%>
  <%-price%>
<% } -%>
```

No we can render items with the template by using the `renderTemplate` transform.

```js
await expect(
  pipeline(
    emitItems(
      { symbol: "GOOG", price: 1349 },
      { symbol: "AAPL", price: 274 },
      { symbol: "AAPL", price: 275 },
      { symbol: "GOOG", price: 1351 },
      { symbol: "AAPL", price: 279 }
    ),
    groupBy("symbol"),
    renderTemplate("stocks.ejs")
  ),
  "to yield items",
  ["GOOG\n  1349\n  1351\n", "AAPL\n  274\n  275\n  279\n"]
);
```

## writeTemplate

Renders an EJS template for each item in the pipeline to a file.

```js
const { renderTemplate } = require("@transformation/ejs");
```

Let say we want to render stock items with a custom template. Let's start out by defining the template in a file called `stocks.ejs`.

```ejs
<%-key%>
<% for(let { price } of items) { -%>
  <%-price%>
<% } -%>
```

No we can render items with the template by using the `renderTemplate` transform.

```js
await program(
  emitItems(
    { symbol: "GOOG", price: 1349 },
    { symbol: "AAPL", price: 274 },
    { symbol: "AAPL", price: 275 },
    { symbol: "GOOG", price: 1351 },
    { symbol: "AAPL", price: 279 }
  ),
  groupBy("symbol"),
  renderTemplate(stocksTemplatePath, ({ key }) => `stocks-${key}.txt`)
);
```

This will create two files with the following content.

`stocks-APPL.txt`:

```
AAPL: 274
AAPL: 275
AAPL: 279
```

`stocks-GOOG.txt`:

```
GOOG: 1349
GOOG: 1351"
```

You can of cause also just write items to one file, you just needs to make sure to aggregate the pipeline into one item first.

Here we define a template that will render a an array of stocks in a file called `stocksArray.ejs`.

```ejs
<% for(let { symbol, price } of items) { -%>
<%-symbol%>: <%-price%>
<% } -%>
```

```js
await program(
  emitItems(
    { symbol: "GOOG", price: 1349 },
    { symbol: "AAPL", price: 274 },
    { symbol: "AAPL", price: 275 },
    { symbol: "GOOG", price: 1351 },
    { symbol: "AAPL", price: 279 }
  ),
  sortBy("symbol"),
  toArray(),
  writeTemplate(stockArrayTemplatePath, "stocks.txt")
);
```

This produce the following result.

`stocks.txt`:

```
AAPL: 274
AAPL: 275
AAPL: 279
GOOG: 1349
GOOG: 1351
```
