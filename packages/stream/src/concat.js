const {
  chose,
  map,
  partitionBy,
  pipeline,
  toArray
} = require("@transformation/core");
const Chunk = require("./Chunk");

const concat = () =>
  pipeline(
    partitionBy(v => (v instanceof Chunk ? `chunk-${v.encoding}` : "other")),
    chose(({ key }) => (key === "other" ? "other" : "chunks"), {
      other: map(({ items }) => items.join("")),
      chunks: map(({ items: chunks }) => {
        if (chunks.length === 0) return [];

        const firstChunk = chunks[0];

        if (Buffer.isBuffer(firstChunk.data)) {
          const encoding = firstChunk.encoding || "utf8";
          return Buffer.concat(chunks.map(({ data }) => data)).toString(
            encoding
          );
        } else {
          return chunks.map(({ data }) => data).join("");
        }
      })
    }),
    toArray(),
    map(items => items.join(""))
  );

module.exports = concat;
