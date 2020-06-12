# @transformation/glob

A package used to find paths matching glob patterns.

<!-- toc -->

- [glob](#glob)
- [globEach](#globeach)

<!-- tocstop -->

## glob

Glob for file paths using [globby](https://www.npmjs.com/package/globby) and
emit the paths as items.

```js
const { glob } = require("@transformation/glob");
```

The simplest example is to just glob for a pattern. You can also provide an
array of patterns as well.

```js
await expect(
  pipeline(glob("reports/20*/report.txt"), sort()),
  "to yield items",
  [
    "reports/2020/report.txt",
    "reports/2021/report.txt",
    "reports/2022/report.txt"
  ]
);
```

If you need more control you can provide an options object that supports all of
the options of [globby](https://www.npmjs.com/package/globby#options). Notice
that also provide the patterns as options.

```js
await expect(
  pipeline(glob({ cwd: "reports", pattern: "2020/*.txt" }), sort()),
  "to yield items",
  ["2020/report.txt", "2020/transactions.txt"]
);
```

## globEach

Run a glob for incoming glob patterns and emit the paths.

```js
const { globEach } = require("@transformation/glob");
```

```js
await expect(
  pipeline(
    emitItems("reports/20*/report.txt", "reports/2020/*.txt", [
      "reports/2020/report.txt",
      "reports/2021/report.txt"
    ]),
    globEach({ cwd: testDir }),
    sort()
  ),
  "to yield items",
  [
    "reports/2020/report.txt",
    "reports/2020/report.txt",
    "reports/2020/report.txt",
    "reports/2020/transactions.txt",
    "reports/2021/report.txt",
    "reports/2021/report.txt",
    "reports/2022/report.txt"
  ]
);
```

You can also consume glob options and overlay options or patterns from the
`globEach` transformation.

```js
await expect(
  pipeline(
    emitItems("2020", "2021"),
    map(year => ({ cwd: path.join(testDir, year) })),
    globEach({ pattern: "*.txt", absolute: true }),
    map(path => path.replace(/.*\/examples\//, "examples/")),
    sort()
  ),
  "to yield items",
  [
    "examples/reports/2020/report.txt",
    "examples/reports/2020/transactions.txt",
    "examples/reports/2021/report.txt",
    "examples/reports/2021/transactions.txt"
  ]
);
```
