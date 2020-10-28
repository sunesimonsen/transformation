# @transformation/process

A package for using child processes.

<!-- toc -->

- [startProcess/childProcess](#startprocesschildprocess)

<!-- tocstop -->

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
