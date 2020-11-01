# @transformation/stream

A package for integrating with Node streams.

<!-- toc -->

- [concat](#concat)
- [fromFileStream](#fromfilestream)
- [fromStream](#fromstream)
- [lines](#lines)
- [pipe](#pipe)
- [toFileStream](#tofilestream)
- [toStream](#tostream)

<!-- tocstop -->

## concat

Concatenates all of output of a stream into a string.

```js
const { concat } = require("@transformation/stream");
```

```js
await expect(pipeline(toFileStream(testFile), concat()), "to yield items", [
  fs.readFileSync(testFile, "utf8")
]);
```

## fromFileStream

Emits all chunks from a Node readable file stream.

Notice this step won't take any input, it only outputs the given items.

```js
const { fromFileStream } = require("@transformation/stream");
```

```js
const { Chunk } = require("@transformation/stream");

await expect(fromFileStream(testFile, { encoding: "utf8" }), "to yield items", [
  new Chunk(fs.readFileSync(testFile, "utf8"), "utf8")
]);
```

## fromStream

Emits all chunks or values of one or more Node readable streams.

Notice this step won't take any input, it only outputs the given items.

```js
const { fromStream } = require("@transformation/stream");
```

When given an encoded stream the data in the chunks is strings.

```js
const { Chunk } = require("@transformation/stream");

await expect(
  fromStream(fs.createReadStream(testFile, { encoding: "utf8" })),
  "to yield items",
  [new Chunk(fs.readFileSync(testFile, "utf8"), "utf8")]
);
```

If no encoding is given the data is buffers.

```js
const { Chunk } = require("@transformation/stream");

await expect(fromStream(fs.createReadStream(testFile)), "to yield items", [
  new Chunk(fs.readFileSync(testFile), null)
]);
```

In case the stream is in object mode, like a byline stream, it emits all of the objects.

```js
const byline = require("byline");

await expect(
  fromStream(byline(fs.createReadStream("song.txt"), { encoding: "utf8" })),
  "to yield items",
  [
    "One little sheep",
    "Two little birds",
    "Three little pigs",
    "Four little hedgehogs",
    "Five little hippos",
    "Six little frogs",
    "Seven little worms",
    "Eight little turtles",
    "Nine little lions",
    "Ten chickens"
  ]
);
```

When given multiple streams each stream will be fully flushed before continuing
to the next.

```js
const { Chunk } = require("@transformation/stream");

await expect(
  fromStream(fs.createReadStream(testFile), fs.createReadStream(testFile)),
  "to yield items",
  [
    new Chunk(fs.readFileSync(testFile), null),
    new Chunk(fs.readFileSync(testFile), null)
  ]
);
```

## lines

Emits all of the lines of the incoming strings or chunks.

```js
const { lines } = require("@transformation/stream");
```

```js
await expect(
  fromStream(fs.createReadStream("song.txt"), lines()),
  "to yield items",
  [
    "One little sheep",
    "Two little birds",
    "Three little pigs",
    "Four little hedgehogs",
    "Five little hippos",
    "Six little frogs",
    "Seven little worms",
    "Eight little turtles",
    "Nine little lions",
    "Ten chickens"
  ]
);
```

You can also specify the separator that is used to split lines, it can be a
string, a regex or a byte.

```js
await expect(
  pipeline(
    spawn("find", [".", "-name", "*.txt", "-print0"], { cwd: testDir }),
    lines(0),
    skipLast()
  ),
  "to yield items",
  ["./2.txt", "./0.txt", "./1.txt"]
);
```

## pipe

Pipes all items of the pipeline through a Node transform stream.

```js
const { pipe } = require("transformation/stream");
```

Let's say we want to pipe all chunks of a file through the
[byline](https://www.npmjs.com/package/byline) transform stream to upload the
lines of the file.

```js
const { LineStream } = require("byline");

await expect(
  pipeline(
    fromStream(fs.createReadStream("æøå.txt", { encoding: "utf8" })),
    pipe(new LineStream())
  ),
  "to yield items",
  ["Æble", "og", "blåbær", "grød", "er", "lækkert!"]
);
```

If you pipe strings into a transform stream, they will be interpreted as UTF-8 chunks.

```js
await expect(
  pipeline(
    emitItems("one\ntwo\n", "three", "\nfour\nfive"),
    pipe(new LineStream())
  ),
  "to yield items",
  ["one", "two", "three", "four", "five"]
);
```

## toFileStream

Writes all items to a Node writable file stream as a side-effect.

Notice that the items will continue through the rest of the pipeline.

```js
const { toFileStream } = require("transformation/stream");
```

Let's write some lines to an output file.

```js
await program(
  emitItems("one", "two", "three"),
  interleave("\n"),
  toFileStream(outputFile)
);

expect(await readFile(outputFile, "utf8"), "to equal", "one\ntwo\nthree");
```

## toStream

Writes all items to a Node writable stream as a side-effect.

Notice that the items will continue through the rest of the pipeline.

```js
const { toStream } = require("transformation/stream");
```

Let's say we want to add line numbers to all lines in a file and write is back
out to another file. We can do that the following way.

```js
await program(
  fromStream(fs.createReadStream("count.txt")),
  lines(),
  map((line, i) => `${i}) ${line}`),
  interleave("\n"),
  toStream(fs.createWriteStream(outputFile))
);

expect(
  await readFile(outputFile, "utf8"),
  "to equal",
  "0) one\n1) two\n2) three"
);
```
