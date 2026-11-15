const startOfMonth = (year, month) => new Date(year, month - 1, 1);
const endOfMonth = (year, month) => new Date(year, month, 1);

const startOfYear = (year) => new Date(year, 0, 1);
const endOfYear = (year) => new Date(year + 1, 0, 1);

module.exports = {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear
};