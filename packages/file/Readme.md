# @transformation/file

A package for using child processes.

<!-- toc -->

- [readFile](#readfile)
- [readEachFile](#readeachfile)
- [writeFile](#writefile)
- [writeEachFile](#writeeachfile)

<!-- tocstop -->

## readFile

Reads the content of a given file into the pipeline.

Notice this step won't take any input, it only outputs file content.

```js
const { readFile } = require("@transformation/file");
```

If you have a file _count.txt_ with the following content.

```
one
two
three
```

Then you can read that into the pipeline this way:

```js
import { splitIterable } from "@transformation/core";

await expect(
  pipeline(
    readFile("count.txt", "utf8"),
    data => data.trim().split("\n"),
    splitIterable()
  ),
  "to yield items",
  ["one", "two", "three"]
);
```

If we want to read the name of a package, we can combine `readFile` with
`fromJSON`.

```js
const { pipeline, fromJSON, map } = require("@transformation/core");

await expect(
  pipeline(
    readFile("package.json", "utf8"),
    fromJSON(),
    map(({ name }) => name)
  ),
  "to yield items",
  ["@transformation/file"]
);
```

## readEachFile

Read incoming paths into a file entry that contains the path and the content.

```js
const { readEachFile } = require("@transformation/file");
```

If you have three files with the following content.

- 1.txt: one
- 2.txt: two
- 3.txt: three

Then you can read them into the pipeline this way:

```js
import { emitItems, pipeline } from "@transformation/core";

await expect(
  pipeline(emitItems("1.txt", "2.txt", "3.txt"), readEachFile("utf8")),
  "to yield items",
  [
    {
      path: "1.txt",
      data: "one"
    },
    {
      path: "2.txt",
      data: "two"
    },
    {
      path: "3.txt",
      data: "three"
    }
  ]
);
```

## writeFile

Write each item to the given path as a side-effect.

```js
import { writeFile } from "@translation/file";
```

```js
import { emitItems, pipeline } from "@transformation/core";

await expect(
  pipeline(emitItems("Hello", "world"), writeFile("./output.txt")),
  "to yield items",
  ["Hello", "world"]
);

await expect(fs.readFileSync("./output.txt", "utf8"), "to equal", "world");
```

## writeEachFile

Write each item to a file.

```js
import { writeEachFile } from "@translation/file";
```

If you provide a function as the argument, it will write the content of the item
to the path returned by the function.

```js
import { emitItems, pipeline } from "@transformation/core";

await expect(
  pipeline(
    emitItems("hello", "world"),
    writeEachFile(value => path.join(outputDir, `${value}.txt`))
  ),
  "to yield items",
  ["hello", "world"]
);

await expect(fs.readFileSync("./hello.txt", "utf8"), "to equal", "hello");
await expect(fs.readFileSync("./world.txt", "utf8"), "to equal", "world");
```

If you don't provide a function, the 'path', 'data' and 'options' will be read
from the incoming items.

```js
import { emitItems, program } from "@transformation/core";

await program(
  emitItems(
    { path: "1.txt", data: "one", options: { encoding: "utf8" } },
    { path: "2.txt", data: "two", options: "utf8" },
    { path: "3.txt", data: "three" }
  ),
  writeEachFile()
);

await expect(fs.readFileSync("./1.txt", "utf8"), "to equal", "one");
await expect(fs.readFileSync("./2.txt", "utf8"), "to equal", "two");
await expect(fs.readFileSync("./3.txt", "utf8"), "to equal", "three");
```

Let's do a bit more advanced example, where we glob for files, upper case their
content and write them back to disk.

```js
import { glob } from "@transformation/glob";
import { map, program, transform } from "@transformation/core";
import { readEachFile, writeEachFile } from "@transformation/file";

await program(
  glob("./test/*.txt"),
  readEachFile("utf8"),
  transform({
    data: map(data => data.toUpperCase())
  }),
  writeEachFile()
);
```
