const expect = require("unexpected").clone().use(require("unexpected-steps"));
const path = require("path");
const fs = require("fs");
const { emitItems, pipeline } = require("@transformation/core");
const fromStream = require("./fromStream");
const pipe = require("./pipe");
const { LineStream } = require("byline");

const testDir = path.join(__dirname, "..", "test");
const testFile = path.join(testDir, "æøå.txt");

const files = [
  "CRLF.txt",
  "empty-lines.txt",
  "empty.txt",
  "rfc.txt",
  "rfc_huge.txt",
  "song.txt",
];

describe("pipe", () => {
  describe("when encoding isn't specified", () => {
    it("pipes all chunks through a transform stream with no encoding", async () => {
      await expect(
        pipeline(
          fromStream(fs.createReadStream(testFile)),
          pipe(new LineStream())
        ),
        "to yield items",
        [
          Buffer.from([0xc3, 0x86, 0x62, 0x6c, 0x65]),
          Buffer.from([0x6f, 0x67]),
          Buffer.from([0x62, 0x6c, 0xc3, 0xa5, 0x62, 0xc3, 0xa6, 0x72]),
          Buffer.from([0x67, 0x72, 0xc3, 0xb8, 0x64]),
          Buffer.from([0x65, 0x72]),
          Buffer.from([0x6c, 0xc3, 0xa6, 0x6b, 0x6b, 0x65, 0x72, 0x74, 0x21]),
        ]
      );
    });
  });

  describe("when encoding is specified", () => {
    it("pipes all chunks through a transform stream using with the given encoding", async () => {
      await expect(
        pipeline(
          fromStream(fs.createReadStream(testFile, { encoding: "utf8" })),
          pipe(new LineStream())
        ),
        "to yield items",
        ["Æble", "og", "blåbær", "grød", "er", "lækkert!"]
      );
    });
  });

  it("pipes all chunks through a transform stream using with the given encoding", async () => {
    await expect(
      pipeline(
        emitItems("one\ntwo\n", "three", "\nfour\nfive"),
        pipe(new LineStream())
      ),
      "to yield items",
      ["one", "two", "three", "four", "five"]
    );
  });

  for (const file of files) {
    it(`handles ${file}`, async () => {
      const filePath = path.join(testDir, file);
      const expected = [];

      const expectedStream = fs
        .createReadStream(filePath)
        .pipe(new LineStream({ keepEmptyLines: true }));

      for await (const line of expectedStream) {
        expected.push(line);
      }

      await expect(
        pipeline(
          fromStream(fs.createReadStream(filePath)),
          pipe(new LineStream({ keepEmptyLines: true }))
        ),
        "to yield items",
        expected
      );
    });
  }
});
