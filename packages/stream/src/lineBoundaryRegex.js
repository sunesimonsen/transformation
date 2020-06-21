// see: http://www.unicode.org/reports/tr18/#Line_Boundaries
const lineBoundaryRegex = /\r\n|[\n\v\f\r\x85\u2028\u2029]/g;

module.exports = lineBoundaryRegex;
