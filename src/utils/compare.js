const compare = (a, b) => {
  if (a.point > b.point) return 1;
  return -1;
};

module.exports = compare;
