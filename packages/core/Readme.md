# @transformation/core

<!-- toc -->

- [accumulate](#accumulate)
- [buffer](#buffer)
  - [fixed buffer (default)](#fixed-buffer-default)
  - [dropping buffer](#dropping-buffer)
  - [sliding buffer](#sliding-buffer)
- [chose](#chose)
- [delay](#delay)
- [emitAll](#emitall)
- [emitItems](#emititems)
- [emitRange](#emitrange)
- [emitRepeat](#emitrepeat)
- [extend](#extend)
- [frequencies](#frequencies)
- [parallel](#parallel)
- [filter](#filter)
- [flatMap](#flatmap)
- [forEach](#foreach)
- [fork](#fork)
- [fromJSON](#fromjson)
- [groupBy](#groupby)
- [interleave](#interleave)
- [join](#join)
- [keyBy](#keyby)
- [map](#map)
- [memorize](#memorize)
- [partition](#partition)
- [partitionBy](#partitionby)
- [pipeline](#pipeline)
- [program](#program)
- [reduce](#reduce)
- [reverse](#reverse)
- [skip](#skip)
- [skipLast](#skiplast)
- [sort](#sort)
- [sortBy](#sortby)
- [splitIterable](#splititerable)
- [take](#take)
- [tap](#tap)
- [toArray](#toarray)
- [transform](#transform)
- [uniq](#uniq)
- [uniqBy](#uniqby)
- [unless](#unless)
- [when](#when)
- [withGroup](#withgroup)
- [Utilities](#utilities)
  - [takeAll](#takeall)
- [Building new steps](#building-new-steps)

<!-- tocstop -->

## accumulate

Produces the next item based on the current and the previous item:

```js
const { accumulate } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5),
    accumulate((n, previous) => ({ n, total: previous.total + n }), {
      total: 0
    })
  ),
  "to yield items",
  [
    { n: 0, total: 0 },
    { n: 1, total: 1 },
    { n: 2, total: 3 },
    { n: 3, total: 6 },
    { n: 4, total: 10 },
    { n: 5, total: 15 }
  ]
);
```

## buffer

Adds a buffer of a given size into the pipeline.

```js
const { buffer } = require("@transformation/core");
```

### fixed buffer (default)

A fixed size buffer of n slots. It will wait when there is no more space
awailable.

```js
await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5), buffer(3), delay(1)),
  "to yield items",
  [0, 1, 2, 3, 4, 5]
);
```

### dropping buffer

A fixed size buffer of n slots. It will drop incoming items when there is no
more space awailable.

```js
await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5), buffer(3, "sliding"), delay(1)),
  "to yield items",
  [3, 4, 5]
);
```

### sliding buffer

A fixed size buffer of n slots. It will drop outgoing items when there is no
more space awailable.

```js
await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5), buffer(3, "dropping"), delay(1)),
  "to yield items",
  [0, 1, 2]
);
```

## chose

Choses a pipeline based on a given selector.

```js
const { chose } = require("@transformation/core");
```

The selector is a function that returns a string deciding the pipeline to use.

If the selector is just a string, that pipeline will always be chosen.

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
    chose(n => (n % 2 === 0 ? "even" : "odd"), {
      even: map(n => n * 2),
      odd: map(n => n * -2)
    })
  ),
  "to yield items",
  [0, -2, 4, -6, 8, -10, 12, -14, 16, -18]
);
```

Notice: because we need to keep the ordering, the pipeline in the individual cases will only
process one item a time, so if you call [toArray](#toArray) you will get an array of that item.
But if you hard-code the choice as a string, it doesn't have this limitation.

## delay

Waits the given amount of miliseconds before emitting each item.

```js
const { delay } = require("@transformation/core");
```

```js
await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5), delay(1)),
  "to yield items",
  [0, 1, 2, 3, 4, 5]
);
```

## emitAll

Emits all the items in the given iterator into the pipeline.

Notice this step won't take any input, it only outputs the given items.

```js
const { emitItems } = require("@transformation/core");
```

Emitting items from an array.

```js
await expect(emitAll([0, 1, 2, 3, 4, 5]), "to yield items", [0, 1, 2, 3, 4, 5]);
```

Emitting items from an iterable.

```js
function* iterable() {
  for (let i = 0; i < 6; i++) {
    yield i;
  }
}

await expect(emitAll(iterable()), "to yield items", [0, 1, 2, 3, 4, 5]);
```

Emitting items from an async iterable.

```js
async function* asyncIterable() {
  for (let i = 0; i < 6; i++) {
    await sleep(1);
    yield i;
  }
}

await expect(emitAll(asyncIterable()), "to yield items", [0, 1, 2, 3, 4, 5]);
```

You can emit items from multiple iterable in the order they are given.

```js
async function* asyncIterable() {
  for (let i = 0; i < 3; i++) {
    await sleep(1);
    yield i;
  }
}

await expect(emitAll(asyncIterable(), [3, 4, 5]), "to yield items", [
  0,
  1,
  2,
  3,
  4,
  5
]);
```

## emitItems

Emits the given items into the pipeline.

Notice this step wont take any input from the pipeline, it only outputs the
given items.

```js
const { emitItems } = require("@transformation/core");
```

```js
await expect(emitItems(0, 1, 2, 3, 4, 5), "to yield items", [0, 1, 2, 3, 4, 5]);
```

## emitRange

Emits the given range into the pipeline.

The range goes from `start` up to but not including `end`. You can specify a `step` that will decide delta between the values.

Notice this step wont take any input from the pipeline, it only outputs the
given range.

When only given a positive number, it emits values from zero up to, but not including, that number.

```js
const { emitRange } = require("@transformation/core");
```

```js
await expect(emitRange(5), "to yield items", [0, 1, 2, 3, 4]);
```

When given a negative number, it emits values from zero down to, but not including, that number.
numbers.

```js
await expect(emitRange(-5), "to yield items", [0, -1, -2, -3, -4]);
```

When given a `start` and an `end`, where `start` is less than or equal to `end`, it emits values from `start` up to, but not including, `end`.

```js
await expect(emitRange(2, 7), "to yield items", [2, 3, 4, 5, 6]);
```

When given a `start` and an `end`, where `start` is greater than `end`, it emits values from `start` down to, but not including, `end`.

```js
await expect(emitRange(2, 7), "to yield items", [7, 6, 5, 4, 3]);
```

Finally you can also provide the `step` value.

```js
await expect(emitRange(-5, 5, 3), "to yield items", [-5, -2, 1, 4]);
```

You can also provide a negative step.

```js
await expect(emitRange(5, -5, -3), "to yield items", [5, 2, -1, -4]);
```

## emitRepeat

Cycles the items the specified number of times.

```js
import { emitRepeat } from "@transformation/core";
```

```js
await expect(emitRepeat(["hi", "hey", "hello"], 5), "to yield items", [
  "hi",
  "hey",
  "hello",
  "hi",
  "hey"
]);
```

When only given a single item, it will be repeated the specified number of times.

```js
await expect(emitRepeat("hi", 5), "to yield items", [
  "hi",
  "hi",
  "hi",
  "hi",
  "hi"
]);
```

If you don't specify the number items you want, it will keep emitting the forever. This can be useful together with [delay](#delay) to build polling as an example.

```js
await expect(
  pipeline(emitRepeat(["hi", "hey", "hello"]), take(5)),
  "to yield items",
  ["hi", "hey", "hello", "hi", "hey"]
);
```

## extend

It extends all items that are objects with the given description.

```js
const { extend } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(
      { firstName: "Jane", lastName: "Doe" },
      { firstName: "John", lastName: "Doe" }
    ),
    extend({
      type: "person",
      fullName: map(({ firstName, lastName }) => `${firstName} ${lastName}`),
      details: {
        nationality: "Danish",
        initials: ({ firstName, lastName }) => `${firstName[0]}${lastName[0]}`
      }
    })
  ),
  "to yield items",
  [
    {
      type: "person",
      firstName: "Jane",
      lastName: "Doe",
      fullName: "Jane Doe",
      details: { nationality: "Danish", initials: "JD" }
    },
    {
      type: "person",
      firstName: "John",
      lastName: "Doe",
      fullName: "John Doe",
      details: { nationality: "Danish", initials: "JD" }
    }
  ]
);
```

## frequencies

Counts frequencies of items in the pipeline.

```js
const { frequencies } from '@transformation/core'
```

When given no arguments, it counts the items by identity.

```js
await expect(
  pipeline(
    emitItems("foo", "bar", "baz", "qux", "qux", "baz", "qux", "foo"),
    frequencies()
  ),
  "to yield items",
  [{ foo: 2, bar: 1, baz: 2, qux: 3 }]
);
```

When given a field, it counts items by that field.

```js
await expect(
  pipeline(
    emitItems(
      { id: 0, name: "foo" },
      { id: 1, name: "bar" },
      { id: 2, name: "baz" },
      { id: 3, name: "qux" },
      { id: 4, name: "qux" },
      { id: 5, name: "baz" },
      { id: 6, name: "qux" },
      { id: 7, name: "foo" }
    ),
    frequencies("name")
  ),
  "to yield items",
  [{ foo: 2, bar: 1, baz: 2, qux: 3 }]
);
```

When given a function, it counts items by the returned value.

```js
await expect(
  pipeline(
    emitItems(
      { id: 0, name: "foo" },
      { id: 1, name: "bar" },
      { id: 2, name: "baz" },
      { id: 3, name: "qux" },
      { id: 4, name: "qux" },
      { id: 5, name: "baz" },
      { id: 6, name: "qux" },
      { id: 7, name: "foo" }
    ),
    frequencies(({ name }) => name[0])
  ),
  "to yield items",
  [{ f: 2, b: 3, q: 3 }]
);
```

## parallel

Run the given step with the specified concurrency. If no concurrency is
specified, it will default to 2 times the number of CPU's available.

```js
const { parallel } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(5, 4, 3, 2, 1, 0),
    parallel(
      map(async n => {
        await sleep(n);
        return n + 1;
      }),
      4
    )
  ),
  "to yield items satisfying to contain",
  1,
  2,
  3,
  4,
  5,
  6
);
```

## filter

Filter items with the given predicate.

```js
const { filter } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5),
    filter(n => n % 2 === 0)
  ),
  "to yield items",
  [0, 2, 4]
);
```

## flatMap

Maps each item with the given mapper, if a returned item is an array it emits
the items individually.

```js
const { flatMap } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5),
    flatMap(n => (n % 2 === 0 ? [n, n] : n))
  ),
  "to yield items",
  [0, 0, 1, 2, 2, 3, 4, 4, 5]
);
```

## forEach

Performs a side-effect for each item.

```js
const { forEach } = require("@transformation/core");
```

```js
const items = [];

await program(
  emitItems(0, 1, 2, 3, 4, 5),
  forEach(item => items.push(item))
);

expect(items, "to equal", [0, 1, 2, 3, 4, 5]);
```

## fork

Forks the pipeline into two.

```js
const { fork } = require("@transformation/core");
```

```js
const forkedOutput = [];

await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5),
    fork(
      map(n => n * n),
      delay(10),
      forEach(n => {
        forkedOutput.push(n);
      })
    ),
    filter(n => n % 2 === 0)
  ),
  "to yield items",
  [0, 2, 4]
);

expect(forkedOutput, "to equal", [0, 1, 4, 9, 16, 25]);
```

## fromJSON

Parses every items in the pipeline as JSON.

```js
import { fromJSON } from "@transformation/core";
```

```js
await expect(
  pipeline(
    emitItems('{ "foo": "bar", "year": 2000 }', "1", "{}", "true"),
    fromJSON()
  ),
  "to yield items",
  [{ foo: "bar", year: 2000 }, 1, {}, true]
);
```

## groupBy

Groups all the items in the pipeline by a key.

Notice that this step will consume all items in the pipeline before emiting the
groups.

```js
const { groupBy } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5, 6),
    groupBy(value => (value % 2 === 0 ? "even" : "odd"))
  ),
  "to yield items",
  [
    Group.create({ key: "even", items: [0, 2, 4, 6] }),
    Group.create({ key: "odd", items: [1, 3, 5] })
  ]
);
```

You can also give the `groupBy` a field to group objects by.

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
    groupBy("symbol")
  ),
  "to yield items",
  [
    Group.create({
      key: "GOOG",
      items: [
        { symbol: "GOOG", price: 1349 },
        { symbol: "GOOG", price: 1351 }
      ]
    }),
    Group.create({
      key: "AAPL",
      items: [
        { symbol: "AAPL", price: 274 },
        { symbol: "AAPL", price: 275 },
        { symbol: "AAPL", price: 279 }
      ]
    })
  ]
);
```

You can transform the items of a group with [withGroup](#withGroup).

## interleave

Interleaves the given separators between the items in the pipeline.

```js
const { interleave } = require("@transformation/core");
```

```js
await expect(
  pipeline(emitItems("0", "1", "2", "3", "4", "5"), interleave(",")),
  "to yield items",
  ["0", ",", "1", ",", "2", ",", "3", ",", "4", ",", "5"]
);
```

When given multiple separators, they are cycled.

```js
await expect(
  pipeline(emitItems("0", "1", "2", "3", "4", "5"), interleave(",", "-", "|")),
  "to yield items",
  ["0", ",", "1", "-", "2", "|", "3", ",", "4", "-", "5"]
);
```

## join

Joins all the items in the pipeline into a string with a given separator.

```js
const { join } = require("@transformation/core");
```

```js
await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5), join(" - ")),
  "to yield items",
  ["0 - 1 - 2 - 3 - 4 - 5"]
);
```

If you don't specify the separator it defaults to comma.

```js
await expect(pipeline(emitItems(0, 1, 2, 3, 4, 5), join()), "to yield items", [
  "0,1,2,3,4,5"
]);
```

## keyBy

Indexes each item into to an object by the selected keys.

```js
const { keyBy } = require("@transformation/core");
```

When given a field, it indexes the items in the pipeline keyed by the given field.

```js
await expect(
  pipeline(
    emitItems(
      { id: 0, name: "foo" },
      { id: 1, name: "bar" },
      { id: 2, name: "baz" },
      { id: 3, name: "qux" }
    ),
    keyBy("id")
  ),
  "to yield items",
  [
    {
      0: { id: 0, name: "foo" },
      1: { id: 1, name: "bar" },
      2: { id: 2, name: "baz" },
      3: { id: 3, name: "qux" }
    }
  ]
);
```

You can also provide a function the will be used to select the key to index by.

```js
await expect(
  pipeline(
    emitItems(
      { id: 0, name: "foo" },
      { id: 1, name: "bar" },
      { id: 2, name: "baz" },
      { id: 3, name: "qux" }
    ),
    keyBy(({ name }) => name)
  ),
  "to yield items",
  [
    {
      foo: { id: 0, name: "foo" },
      bar: { id: 1, name: "bar" },
      baz: { id: 2, name: "baz" },
      qux: { id: 3, name: "qux" }
    }
  ]
);
```

## map

Maps each item with the given mapper.

```js
const { map } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5),
    map(n => n * n)
  ),
  "to yield items",
  [0, 1, 4, 9, 16, 25]
);
```

## memorize

Memorizes the given step.

```js
const { memorize } = require("@transformation/core");
```

```js
let i = 0;

await expect(
  pipeline(
    emitItems(0, 1, 2, 0, 1, 2, 0, 1, 2),
    memorize(map(v => `${v}: ${i++}`))
  ),
  "to yield items",
  ["0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2"]
);
```

You can specify the size of the LRU cache, by default it is unbounded.

```js
let i = 0;

await expect(
  pipeline(
    emitItems(0, 1, 2, 0, 1, 2, 0, 1, 2),
    memorize(
      map(v => `${v}: ${i++}`),
      { maxSize: 2 }
    )
  ),
  "to yield items",
  ["0: 0", "1: 1", "2: 2", "0: 0", "1: 3", "2: 2", "0: 4", "1: 3", "2: 5"]
);
```

You can specify a field to use for caching. By default it uses the identity function for computing the cache key.

```js
let i = 0;

await expect(
  pipeline(
    emitItems(0, 1, 2, 0, 1, 2, 0, 1, 2),
    map(key => ({ key, time: i++ })),
    memorize(
      map(({ key, time }) => `${key}: ${time}`),
      { key: "key" }
    )
  ),
  "to yield items",
  ["0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2"]
);
```

Finally you can specify a function to compute the cache key.

```js
let i = 0;

await expect(
  pipeline(
    emitItems(0, 1, 2, 0, 1, 2, 0, 1, 2),
    map(key => ({ key, time: i++ })),
    memorize(
      map(({ key, time }) => `${key}: ${time}`),
      { key: v => v.key }
    )
  ),
  "to yield items",
  ["0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2", "0: 0", "1: 1", "2: 2"]
);
```

## partition

Partition items into groups of the given size.

```js
const { partition } = require("@transformation/core");
```

```js
await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5, 6), partition(2)),
  "to yield items",
  [
    Group.create({ key: "[0;1]", items: [0, 1] }),
    Group.create({ key: "[2;3]", items: [2, 3] }),
    Group.create({ key: "[4;5]", items: [4, 5] }),
    Group.create({ key: "[6;7]", items: [6] })
  ]
);
```

## partitionBy

Partition items into groups by the given selector.

```js
const { partitionBy } = require("@transformation/core");
```

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
    partitionBy(({ symbol }) => symbol)
  ),
  "to yield items",
  [
    Group.create({
      key: "GOOG",
      items: [{ symbol: "GOOG", price: 1349 }]
    }),
    Group.create({
      key: "AAPL",
      items: [
        { symbol: "AAPL", price: 274 },
        { symbol: "AAPL", price: 275 }
      ]
    }),
    Group.create({
      key: "GOOG",
      items: [{ symbol: "GOOG", price: 1351 }]
    }),
    Group.create({
      key: "AAPL",
      items: [{ symbol: "AAPL", price: 279 }]
    })
  ]
);
```

## pipeline

Turns multiple steps into a single step.

```js
const { pipeline } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5),
    pipeline(
      filter(n => n % 2 === 0),
      false && map(n => n * n)
    ),
    map(n => `${n} elephants`)
  ),
  "to yield items",
  ["0 elephants", "2 elephants", "4 elephants"]
);
```

Plain functions will be interpreted as [map](#map).

```js
await expect(
  pipeline(
    emitItems("  \nHere is some text\n  with multiple lines\n   "),
    s => s.trim(),
    s => s.split(/\n/),
    splitIterable(),
    s => s.trim(),
    (s, i) => s.replace(/^/, `${i + 1}) `)
  ),
  "to yield items",
  ["1) Here is some text", "2) with multiple lines"]
);
```

## program

Runs all of the given steps until the output closes.

```js
const { program } = require("@transformation/core");
```

```js
const items = [];

await program(
  emitItems(0, 1, 2, 3, 4, 5),
  forEach(item => items.push(item))
);

expect(items, "to equal", [0, 1, 2, 3, 4, 5]);
```

## reduce

Reduces the given pipeline down to a single item using the given accumulator
function and an initial value.

```js
const { reduce } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5),
    reduce((sum, n) => sum + n, 0)
  ),
  "to yield items",
  [15]
);
```

## reverse

Reverses all of the items in the pipeline and re-emits them one by one.

Notice that this step will consume all of the items in the pipeline.

```js
const { reduce } = require("@transformation/core");
```

```js
await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5), reverse()),
  "to yield items",
  [5, 4, 3, 2, 1, 0]
);
```

## skip

Skips the given number of items before it starts to emitting.

```js
import { skip } from "@transformation/core";
```

```js
await expect(
  pipeline(emitItems([0, 1, 2, 3, 4, 5]), skip(2)),
  "to yield items",
  [2, 3, 4, 5]
);
```

## skipLast

Given a number n, it skips the last n items.

```js
import { skipLast } from "@transformation/core";
```

```js
await expect(
  pipeline(emitItems([0, 1, 2, 3, 4, 5]), skipLast(2)),
  "to yield items",
  [0, 1, 2, 3]
);
```

When given no argument, it skips the last item.

```js
await expect(
  pipeline(emitItems([0, 1, 2, 3, 4, 5]), skipLast()),
  "to yield items",
  [0, 1, 2, 3, 4]
);
```

## sort

Sorts all of the items in the pipeline and re-emits them one by one.

Notice that this step will consume all of the items in the pipeline.

```js
const { sort } = require("@transformation/core");
```

```js
await expect(
  pipeline(emitItems(0, 1, 2, 3, 5, 7, 8, 2, 3, 4, 5), sort()),
  "to yield items",
  [0, 1, 2, 2, 3, 3, 4, 5, 5, 7, 8]
);
```

If you give it a comparison function, it will use that to decide the sorting
order.

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 5, 7, 8, 2, 3, 4, 5),
    sort((a, b) => b - a)
  ),
  "to yield items",
  [8, 7, 5, 5, 4, 3, 3, 2, 2, 1, 0]
);
```

## sortBy

Sorts all of the items in the pipeline by the specified criteria and re-emits
them one by one.

Notice that this step will consume all of the items in the pipeline.

```js
const { sortBy } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(
      { name: "hat", price: 10 },
      { name: "cat", price: 100 },
      { name: "chat", price: 0 }
    ),
    sortBy("price")
  ),
  "to yield items",
  [
    { name: "chat", price: 0 },
    { name: "hat", price: 10 },
    { name: "cat", price: 100 }
  ]
);
```

You can sort by multiple fields and control the direction of the sorted fields.

```js
await expect(
  pipeline(
    emitItems(
      { name: "wat", price: 100 },
      { name: "hat", price: 10 },
      { name: "cat", price: 100 },
      { name: "chat", price: 0 },
      { name: "wat", price: 100 }
    ),
    sortBy("price:desc", "name:asc")
  ),
  "to yield items",
  [
    { name: "cat", price: 100 },
    { name: "wat", price: 100 },
    { name: "wat", price: 100 },
    { name: "hat", price: 10 },
    { name: "chat", price: 0 }
  ]
);
```

You can even use a comparison for full control.

```js
await expect(
  pipeline(
    emitItems(
      { name: "twat", price: 100 },
      { name: "hat", price: 10 },
      { name: "cat", price: 100 },
      { name: "chat", price: 0 },
      { name: "wat", price: 100 }
    ),
    sortBy((a, b) => a.price - b.price, "name:asc")
  ),
  "to yield items",
  [
    { name: "chat", price: 0 },
    { name: "hat", price: 10 },
    { name: "cat", price: 100 },
    { name: "twat", price: 100 },
    { name: "wat", price: 100 }
  ]
);
```

## splitIterable

Re-emits any array as individual items.

```js
const { splitIterable } = require("@transformation/core");
```

```js
await expect(
  pipeline(emitItems(0, [1, 2], [3, 4, 5]), splitIterable()),
  "to yield items",
  [0, 1, 2, 3, 4, 5]
);
```

## take

Emits the given number of items from the pipeline.

```js
import { take } from "@transformation/core";
```

```js
await expect(
  pipeline(emitItems([0, 1, 2, 3, 4, 5]), take(3)),
  "to yield items",
  [0, 1, 2]
);
```

## tap

Print items to the console.

```js
const { tap } = require("@transformation/core");
```

```js
await expect(
  pipeline(
    emitItems(
      { name: "twat", price: 100 },
      { name: "hat", price: 10 },
      { name: "cat", price: 100 },
      { name: "chat", price: 0 },
      { name: "wat", price: 100 }
    )
  ),
  tap(({ name, price }) => `${name}: ${price}`),
  sortBy("price"),
  "to yield items",
  [
    { name: "twat", price: 100 },
    { name: "hat", price: 10 },
    { name: "cat", price: 100 },
    { name: "chat", price: 0 },
    { name: "wat", price: 100 }
  ]
);
```

```
0
[1, 2]
[3, 4, 5]
```

When given a field selector, prints that field to the console.

```js
await expect(
  pipeline(
    emitItems(
      { name: "hat", price: 10 },
      { name: "cat", price: 100 },
      { name: "chat", price: 0 }
    ),
    tap("name"),
    sortBy("price")
  ),
  "to yield items",
  [
    { name: "chat", price: 0 },
    { name: "hat", price: 10 },
    { name: "cat", price: 100 }
  ]
);
```

```
hat
cat
chat
```

When given a function selector, prints the selected output to the console.

```js
await expect(
  pipeline(
    emitItems(
      { name: "hat", price: 10 },
      { name: "cat", price: 100 },
      { name: "chat", price: 0 }
    ),
    tap(({ name, price }) => `${name}: ${price}`),
    sortBy("price")
  ),
  "to yield items",
  [
    { name: "chat", price: 0 },
    { name: "hat", price: 10 },
    { name: "cat", price: 100 }
  ]
);
```

```
hat: 10
cat: 100
chat: 0
```

## toArray

Accumulates all items into an array.

```js
const { toArray } = require("transformation/core");
```

```js
await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5), toArray()),
  "to yield items",
  [[0, 1, 2, 3, 4, 5]]
);
```

## transform

Transforms object trees by running part of the tree though transformations.

```js
await expect(
  pipeline(
    emitItems(
      { symbol: "goog", price: { value: 1349, currency: "USD" } },
      { symbol: "aapl", price: { value: 274, currency: "USD" } },
      { symbol: "aapl", price: { value: 275, currency: "USD" } },
      { symbol: "goog", price: { value: 1351, currency: "USD" } },
      { symbol: "aapl", price: { value: 279, currency: "USD" } }
    ),
    transform({
      symbol: map(symbol => symbol.toUpperCase()),
      price: { value: map(price => price * 2) }
    })
  ),
  "to yield items",
  [
    { symbol: "GOOG", price: { value: 2698, currency: "USD" } },
    { symbol: "AAPL", price: { value: 548, currency: "USD" } },
    { symbol: "AAPL", price: { value: 550, currency: "USD" } },
    { symbol: "GOOG", price: { value: 2702, currency: "USD" } },
    { symbol: "AAPL", price: { value: 558, currency: "USD" } }
  ]
);
```

Only matching parts of an object it transformed.

```js
await expect(
  pipeline(
    emitItems(
      { symbol: "goog", currency: "USD" },
      { symbol: "aapl", price: 274, currency: "USD" },
      "this is not an object",
      null,
      {
        name: "no symbol",
        price: 666,
        currency: "USD",
        nesting: { supported: "yes" }
      },
      { symbol: "aapl", price: 275, currency: "USD" }
    ),
    transform({
      symbol: map(symbol => symbol.toUpperCase()),
      price: map(price => `$${price}`),
      nesting: {
        supported: map(symbol => symbol.toUpperCase())
      }
    })
  ),
  "to yield items",
  [
    { symbol: "GOOG", currency: "USD" },
    { symbol: "AAPL", price: "$274", currency: "USD" },
    "this is not an object",
    null,
    {
      name: "no symbol",
      price: "$666",
      currency: "USD",
      nesting: { supported: "YES" }
    },
    { symbol: "AAPL", price: "$275", currency: "USD" }
  ]
);
```

## uniq

Filters out items that is not unique.

```js
const { uniq } = require("transformations/core");
```

It records items that is already seen and filters out the items that has already been emitted.

```js
await expect(
  pipeline(emitItems(0, 4, 1, 2, 3, 0, 4, 5, 7, 6, 7, 8, 9, 9), uniq()),
  "to yield items",
  [0, 4, 1, 2, 3, 5, 7, 6, 8, 9]
);
```

## uniqBy

Filters out items that is not unique by a selected value.

```js
const { uniqBy } = require("transformations/core");
```

It records items that is already seen and filters out the items that has already been emitted.

```js
await expect(
  pipeline(
    emitItems(
      { id: 0, name: "foo", count: 0 },
      { id: 1, name: "bar", count: 1 },
      { id: 2, name: "baz", count: 2 },
      { id: 0, name: "foo", count: 3 },
      { id: 3, name: "qux", count: 4 },
      { id: 2, name: "baz", count: 5 }
    ),
    uniqBy("id")
  ),
  "to yield items",
  [
    { id: 0, name: "foo", count: 0 },
    { id: 1, name: "bar", count: 1 },
    { id: 2, name: "baz", count: 2 },
    { id: 3, name: "qux", count: 4 }
  ]
);
```

You can also use a function to select the discriminating value.

```js
await expect(
  pipeline(
    emitItems(
      { id: 0, name: "foo", count: 0 },
      { id: 1, name: "bar", count: 1 },
      { id: 2, name: "baz", count: 2 },
      { id: 0, name: "foo", count: 3 },
      { id: 3, name: "qux", count: 4 },
      { id: 2, name: "baz", count: 5 }
    ),
    uniqBy(({ name }) => name)
  ),
  "to yield items",
  [
    { id: 0, name: "foo", count: 0 },
    { id: 1, name: "bar", count: 1 },
    { id: 2, name: "baz", count: 2 },
    { id: 3, name: "qux", count: 4 }
  ]
);
```

## unless

Executes a sub pipeline when a given condition is not meet.

See [when](#when) for the opposite computation.

```js
const { unless } = require("transformation/core");
```

When given a predicate function, it executes the sub pipeline when the predicate
is false.

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5, 6),
    unless(
      n => n % 2 === 0,
      map(n => n * 2),
      map(n => `${n} transformed`)
    )
  ),
  "to yield items",
  [0, "2 transformed", 2, "6 transformed", 4, "10 transformed"]
);
```

When given a boolean that is used to decide if the sub pipeline should be executed.

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5, 6),
    unless(
      true,
      map(n => n * n)
    ),
    unless(
      false,
      map(n => `${n} transformed`)
    )
  ),
  "to yield items",
  [
    "0 transformed",
    "1 transformed",
    "2 transformed",
    "3 transformed",
    "4 transformed",
    "5 transformed",
    "6 transformed"
  ]
);
```

## when

Conditionally executes a sub pipeline.

See [unless](#unless) for the opposite computation.

```js
const { when } = require("transformation/core");
```

When given a predicate function, it executes the sub pipeline when the predicate
is true.

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5, 6),
    when(
      n => n % 2 === 0,
      map(n => n * 2),
      map(n => `${n} transformed`)
    )
  ),
  "to yield items satisfying to contain",
  "0 transformed",
  1,
  "4 transformed",
  3,
  "8 transformed",
  5,
  "12 transformed"
);
```

When given a boolean that is used to decide if the sub pipeline should be executed.

```js
await expect(
  pipeline(
    emitItems(0, 1, 2, 3, 4, 5, 6),
    when(
      true,
      map(n => n * n)
    ),
    when(
      false,
      map(n => `${n} transformed`)
    )
  ),
  "to yield items satisfying to contain",
  0,
  1,
  4,
  9,
  16,
  25,
  36
);
```

## withGroup

Transform items in groups created by [groupBy](#groupBy).

Notice that you can provide one or more transformation steps to `withGroup`.

```js
const { withGroup } = require("transformation/core");
```

Here we attach labels to rows in stock groups.

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
    withGroup(extend({ label: ({ symbol, price }) => `${symbol}: ${price}` }))
  ),
  "to yield items",
  [
    Group.create({
      key: "GOOG",
      items: [
        { symbol: "GOOG", price: 1349, label: "GOOG: 1349" },
        { symbol: "GOOG", price: 1351, label: "GOOG: 1351" }
      ]
    }),
    Group.create({
      key: "AAPL",
      items: [
        { symbol: "AAPL", price: 274, label: "AAPL: 274" },
        { symbol: "AAPL", price: 275, label: "AAPL: 275" },
        { symbol: "AAPL", price: 279, label: "AAPL: 279" }
      ]
    })
  ]
);
```

## Utilities

### takeAll

This function drains all items from a pipeline and returns them as an array.

```js
const { takeAll } = require("transformation/core");
```

```js
const items = await takeAll(
  emitItems(0, 1, 2, 3, 4, 5),
  map(x => x * x)
);

expect(items, "to equal", [0, 1, 4, 9, 16, 25]);
```

## Building new steps

Let's say we want to build a custom step that can't easily be built by composing the existing step. Then you can use the `step` function to create a custom step.

```js
const { step } = require("transformation/core");
```

The step we will use for this example is one that duplicates all items.

```js
const duplicate = () =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      await put(value);
      await put(value);
    }
  });

await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5), duplicate()),
  "to yield items",
  [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
);
```

Notice that most custom steps can just be a composition of existing steps.

As an example let's make a step that averages numbers.

```js
const average = () =>
  pipeline(
    toArray(),
    map(items =>
      items.length === 0
        ? NaN
        : items.reduce((sum, n) => sum + n, 0) / items.length
    )
  );

await expect(
  pipeline(emitItems(0, 1, 2, 3, 4, 5, 6, 7, 8, 9), average()),
  "to yield items",
  [4]
);
```
