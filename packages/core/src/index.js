const accumulate = require("accumulate");
const batch = require("batch");
const buffer = require("buffer");
const delay = require("delay");
const emitItems = require("emitItems");
const fanOut = require("fanOut");
const filter = require("filter");
const flush = require("flush");
const forEach = require("forEach");
const index = require("index");
const map = require("map");
const pipeline = require("pipeline");
const program = require("program");
const reduce = require("reduce");
const sortBy = require("sortBy");
const splitArrays = require("splitArrays");
const takeAll = require("takeAll");
const tap = require("tap");
const toArray = require("toArray");

// TODO fork: fork out of main pipeline
// TODO forkJoin: fork out and return array

module.exports = {
  accumulate,
  batch,
  buffer,
  delay,
  emitItems,
  fanOut,
  filter,
  flush,
  forEach,
  index,
  map,
  pipeline,
  program,
  reduce,
  sortBy,
  splitArrays,
  takeAll,
  tap,
  toArray
};
