# @transformation

[![Build Status](https://travis-ci.org/sunesimonsen/transformation.svg?branch=master)](https://travis-ci.org/sunesimonsen/transformation)

[Communicating Sequential
Processes](https://dl.acm.org/doi/pdf/10.1145/359576.359585) introduced by [Tony
Hoare](https://en.wikipedia.org/wiki/Tony_Hoare) is great way of thinking about
structuring concurrent problems. If you are curious [Rob
Pike](https://en.wikipedia.org/wiki/Rob_Pike) explains the concept very well in
this video:

[![Rob Pike - Concurrency Is Not Parallelism](https://i.ytimg.com/vi/cN_DpYBzKso/hqdefault.jpg)](https://www.youtube.com/watch?v=cN_DpYBzKso)

While Communicating Sequence Processes (CSP) is a very powerful paradigm, it is
also a bit daunting and verbose for simple programs. Especially there is a very
interesting class of programs that just takes input, executes a series of steps
and transformations and outputs the data again. There are numerous examples of
the relevance of this class of programs, [Unix
pipelines](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>), stream processing
like [RxJS](https://rxjs-dev.firebaseapp.com/) or even just a sequential
program.

One of the big benefits of CSP is that you can control the buffering of channel
between sub-processes, this gives you [back
presure](https://en.wikipedia.org/wiki/Back_pressure) and declarative
concurrency out of the box. So compared to normal streaming libraries, you can
create composable building block and control the concurrency from the consumer.

This collection of libraries seek to build an extensive toolkit of processing
steps, that can be composed into processing pipelines.

## Packages

- [@transformation/core](./packages/core/Readme.md) - the core API that everything builds on top of.
- [@transformation/csv](./packages/csv/Readme.md) - read and write CSV files.
- [@transformation/ejs](./packages/ejs/Readme.md) - write files with EJS templates.
- [@transformation/glob](./packages/glob/Readme.md) - find files using glob patterns.
- [@transformation/stream](./packages/stream/Readme.md) - integrate with Node streams.

[Changelog](./CHANGELOG.md)

## Example

Let's try to make a small program that prints packages in this project has a
local dependency on another package.

- glob search for all `package.json` files in the `packages` directory
- read the content of each of the `package.json` files in parallel
- parse the content as JSON
- extend the structure with a new field: `localDependencies`, that is containing
  dependencies starting with `@transformation/`
- filter out packages that don't have local dependencies
- print out the result

```js
const fs = require("fs").promises;

const { glob } = require("./packages/glob");

const {
  extend,
  filter,
  map,
  parallel,
  program,
  tap
} = require("./packages/core");

const main = async () => {
  await program(
    glob("./packages/*/package.json"),
    parallel(map(fs.readFile), 4),
    map(JSON.parse),
    extend({
      localDependencies: map(({ dependencies }) =>
        Object.keys(dependencies).filter(dependency =>
          dependency.startsWith("@transformation/")
        )
      )
    }),
    filter(({ localDependencies }) => localDependencies.length > 0),
    tap(
      ({ name, localDependencies }) =>
        `${name} => ${localDependencies.join(", ")}`
    )
  );
};

main();
```

## Acknowledgment

The library is build on top of a very nice CSP called [medium](https://www.npmjs.com/package/medium).

## MIT License

Copyright (c) 2020 Sune Simonsen <mailto:sune@we-knowhow.dk>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
