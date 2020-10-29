# @transformation/process

A package for using child processes.

<!-- toc -->

- [spawn](#spawn)
- [startProcess/childProcess](#startprocesschildprocess)

<!-- tocstop -->

## spawn

Spawns a new sub-process.
See [Node child_process.spawn](https://nodejs.org/docs/latest/api/child_process.html#child_process_child_process_spawn_command_args_options)
for more information.

```js
import { spawn } from "@transform/process";
import { lines } from "@transform/stream";
import { skipLast } from "@transform/core";
```

You can use it to emit items into the pipeline.

```js
await expect(
  pipeline(spawn("ls", [testDir]), lines(), skipLast()),
  "to yield items",
  ["0.txt", "1.txt", "2.txt"]
);
```

But you can also pipe data into a sub-process.

```js
await expect(
  pipeline(
    emitItems("Hello\nfantastic\nworld"),
    spawn("grep", ["-v", "fantastic"]),
    lines(),
    skipLast()
  ),
  "to yield items",
  ["Hello", "world"]
);
```

Multiple sub-processes can be combined.

```js
await expect(
  pipeline(spawn("ls", [testDir]), spawn("grep", ["0"]), lines(), skipLast()),
  "to yield items",
  ["0.txt"]
);
```

## startProcess/childProcess

Starts a child process pipeline in a new Node instance.

```js
const { startProcess, childProcess } = require("@transformation/process");
```

Notice this is only useful for cases where your pipeline is more CPU intensive
than the overhead of communicating with the child process.

As an example let's try to square numbers in a child process.

We start by defining the child process pipeline (square.js).

```js
module.exports = childProcess(map(n => n * n));
```

Now we can load start the process as part of our pipeline.

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
    startProcess("square.js"))
  ),
  "to yield items",
  [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
);
```

What is happening here, is that every item is serialized and send into the child
process for processing. When the child process emits new items, they are
serialized and passed back to the main pipeline.
