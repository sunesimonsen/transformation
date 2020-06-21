# @transformation/stream

A package for integrating with Node streams.

<!-- toc -->

- [fromStream](#fromstream)
- [lines](#lines)
- [pipe](#pipe)
- [toStream](#tostream)

<!-- tocstop -->

## fromStream

Emits all chunks or values of a given Node readable stream.

Notice this step won't take any input, it only outputs the given items.

```js
const { fromStream } from "@transformation/stream";
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

## lines

Emits all of the lines of the incoming strings or chunks.

```js
const { lines } from "@transformation/stream";
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
