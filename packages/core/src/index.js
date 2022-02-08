const Group = require("./Group");
const accumulate = require("./accumulate");
const appendItems = require("./appendItems");
const buffer = require("./buffer");
const channelStep = require("./channelStep");
const chose = require("./chose");
const cleanup = require("./cleanup");
const debounce = require("./debounce");
const deduplicate = require("./deduplicate");
const deduplicateBy = require("./deduplicateBy");
const defaults = require("./defaults");
const delay = require("./delay");
const emitAll = require("./emitAll");
const emitItems = require("./emitItems");
const emitRange = require("./emitRange");
const emitRepeat = require("./emitRepeat");
const extend = require("./extend");
const filter = require("./filter");
const flatMap = require("./flatMap");
const forEach = require("./forEach");
const fork = require("./fork");
const frequencies = require("./frequencies");
const fromJSON = require("./fromJSON");
const groupBy = require("./groupBy");
const interleave = require("./interleave");
const join = require("./join");
const keyBy = require("./keyBy");
const map = require("./map");
const memorize = require("./memorize");
const parallel = require("./parallel");
const partition = require("./partition");
const partitionBy = require("./partitionBy");
const pipeline = require("./pipeline");
const prependItems = require("./prependItems");
const program = require("./program");
const reduce = require("./reduce");
const reverse = require("./reverse");
const setup = require("./setup");
const skip = require("./skip");
const skipLast = require("./skipLast");
const sort = require("./sort");
const sortBy = require("./sortBy");
const splitIterable = require("./splitIterable");
const step = require("./step");
const take = require("./take");
const takeAll = require("./takeAll");
const throttle = require("./throttle");
const tap = require("./tap");
const toArray = require("./toArray");
const toJSON = require("./toJSON");
const transform = require("./transform");
const uniq = require("./uniq");
const uniqBy = require("./uniqBy");
const unless = require("./unless");
const when = require("./when");
const withGroup = require("./withGroup");

// TODO forkJoin: fork out and return array

module.exports = {
  Group,
  accumulate,
  appendItems,
  buffer,
  channelStep,
  chose,
  cleanup,
  debounce,
  deduplicate,
  deduplicateBy,
  defaults,
  delay,
  emitAll,
  emitItems,
  emitRange,
  emitRepeat,
  extend,
  fanOut: parallel,
  filter,
  flatMap,
  forEach,
  fork,
  frequencies,
  fromJSON,
  groupBy,
  interleave,
  join,
  keyBy,
  map,
  memorize,
  parallel,
  partition,
  partitionBy,
  pipeline,
  prependItems,
  program,
  reduce,
  reverse,
  setup,
  skip,
  skipLast,
  sort,
  sortBy,
  splitArray: splitIterable,
  splitIterable,
  step,
  take,
  takeAll,
  throttle,
  tap,
  toArray,
  toJSON,
  transform,
  uniq,
  uniqBy,
  unless,
  when,
  withGroup,
};
