const expect = require("unexpected")
  .clone()
  .use(require("unexpected-steps"));

const path = require("path");
const { program, pipeline } = require("@transformation/core");
const readCSV = require("./readCSV");

const csvFilePath = path.join(__dirname, "..", "test", "test.csv");

describe("readCSV", () => {
  it("emits all rows from the CSV file at the given path", async () => {
    await expect(pipeline(readCSV(csvFilePath)), "to yield items", [
      {
        time: "2015-12-22T18:45:11.000Z",
        latitude: "59.9988",
        longitude: "-152.7191",
        depth: "100",
        mag: "3",
        magType: "ml",
        nst: "",
        gap: "",
        dmin: "",
        rms: "0.54",
        net: "ak",
        id: "ak12293661",
        updated: "2015-12-22T19:09:29.736Z",
        place: "54km S of Redoubt Volcano, Alaska",
        type: "earthquake"
      },
      {
        time: "2015-12-22T18:38:34.000Z",
        latitude: "62.9616",
        longitude: "-148.7532",
        depth: "65.4",
        mag: "1.9",
        magType: "ml",
        nst: "",
        gap: "",
        dmin: "",
        rms: "0.51",
        net: "ak",
        id: "ak12293651",
        updated: "2015-12-22T18:47:23.287Z",
        place: "48km SSE of Cantwell, Alaska",
        type: "earthquake"
      },
      {
        time: "2015-12-22T18:38:01.820Z",
        latitude: "19.2129993",
        longitude: "-155.4179993",
        depth: "33.79",
        mag: "2.56",
        magType: "ml",
        nst: "56",
        gap: "142",
        dmin: "0.03113",
        rms: "0.21",
        net: "hv",
        id: "hv61132446",
        updated: "2015-12-22T18:44:13.729Z",
        place: "6km E of Pahala, Hawaii",
        type: "earthquake"
      },
      {
        time: "2015-12-22T18:38:00.000Z",
        latitude: "63.7218",
        longitude: "-147.083",
        depth: "56.8",
        mag: "2.4",
        magType: "ml",
        nst: "",
        gap: "",
        dmin: "",
        rms: "0.95",
        net: "ak",
        id: "ak12293653",
        updated: "2015-12-22T18:54:45.265Z",
        place: "75km WSW of Delta Junction, Alaska",
        type: "earthquake"
      },
      {
        time: "2015-12-22T18:28:57.000Z",
        latitude: "64.0769",
        longitude: "-148.8226",
        depth: "14.2",
        mag: "2",
        magType: "ml",
        nst: "",
        gap: "",
        dmin: "",
        rms: "0.8",
        net: "ak",
        id: "ak12293626",
        updated: "2015-12-22T18:40:06.324Z",
        place: "25km NNE of Healy, Alaska",
        type: "earthquake"
      },
      {
        time: "2015-12-22T18:25:40.000Z",
        latitude: "61.4715",
        longitude: "-150.7697",
        depth: "55",
        mag: "1.6",
        magType: "ml",
        nst: "",
        gap: "",
        dmin: "",
        rms: "0.17",
        net: "ak",
        id: "ak12293627",
        updated: "2015-12-22T18:40:07.276Z",
        place: "43km W of Big Lake, Alaska",
        type: "earthquake"
      },
      {
        time: "2015-12-22T18:13:01.786Z",
        latitude: "38.6879",
        longitude: "-118.6035",
        depth: "7.8",
        mag: "1.6",
        magType: "ml",
        nst: "10",
        gap: "105.79",
        dmin: "0.087",
        rms: "0.0799",
        net: "nn",
        id: "nn00523604",
        updated: "2015-12-22T18:26:07.654Z",
        place: "18km N of Hawthorne, Nevada",
        type: "earthquake"
      },
      {
        time: "2015-12-22T18:08:44.630Z",
        latitude: "19.3326664",
        longitude: "-155.1049957",
        depth: "4.52",
        mag: "1.92",
        magType: "md",
        nst: "39",
        gap: "152",
        dmin: "0.05121",
        rms: "0.28",
        net: "hv",
        id: "hv61132431",
        updated: "2015-12-22T18:11:59.980Z",
        place: "17km SE of Volcano, Hawaii",
        type: "earthquake"
      },
      {
        time: "2015-12-22T18:04:36.240Z",
        latitude: "19.4381676",
        longitude: "-155.326004",
        depth: "1.12",
        mag: "2.05",
        magType: "ml",
        nst: "14",
        gap: "314",
        dmin: "0.03707",
        rms: "0.33",
        net: "hv",
        id: "hv61132421",
        updated: "2015-12-22T18:10:19.220Z",
        place: "9km W of Volcano, Hawaii",
        type: "earthquake"
      },
      {
        time: "2015-12-22T17:47:04.720Z",
        latitude: "36.0003319",
        longitude: "-120.5598297",
        depth: "2.18",
        mag: "1.74",
        magType: "md",
        nst: "20",
        gap: "86",
        dmin: "0.0209",
        rms: "0.06",
        net: "nc",
        id: "nc72570651",
        updated: "2015-12-22T17:48:42.120Z",
        place: "23km SW of Coalinga, California",
        type: "earthquake"
      },
      {
        time: "2015-12-22T17:45:24.450Z",
        latitude: "36.0003333",
        longitude: "-120.5606667",
        depth: "2.42",
        mag: "1.51",
        magType: "md",
        nst: "33",
        gap: "86",
        dmin: "0.02151",
        rms: "0.07",
        net: "nc",
        id: "nc72570646",
        updated: "2015-12-22T18:20:19.730Z",
        place: "23km SW of Coalinga, California",
        type: "earthquake"
      },
      {
        time: "2015-12-22T17:36:29.000Z",
        latitude: "63.3915",
        longitude: "-151.219",
        depth: "0",
        mag: "1.5",
        magType: "ml",
        nst: "",
        gap: "",
        dmin: "",
        rms: "0.39",
        net: "ak",
        id: "ak12293479",
        updated: "2015-12-22T17:48:59.977Z",
        place: "113km W of Cantwell, Alaska",
        type: "earthquake"
      },
      {
        time: "2015-12-22T17:15:18.000Z",
        latitude: "60.3672",
        longitude: "-148.253",
        depth: "9.8",
        mag: "2",
        magType: "ml",
        nst: "",
        gap: "",
        dmin: "",
        rms: "0.47",
        net: "ak",
        id: "ak12293473",
        updated: "2015-12-22T17:31:12.369Z",
        place: "51km SSE of Whittier, Alaska",
        type: "earthquake"
      }
    ]);
  });

  it("fails if the file doesn't exists", async () => {
    await expect(
      program(readCSV("wat")),
      "to be rejected with",
      new Error("ENOENT: no such file or directory, open 'wat'")
    );
  });

  it("fails if the file can't be parsed", async () => {
    await expect(
      program(
        readCSV(csvFilePath, {
          maxRowBytes: 10
        })
      ),
      "to be rejected with",
      new Error("Row exceeds the maximum size")
    );
  });
});
