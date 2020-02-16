
function isNumber(a) {
  return isNaN(a) || isNaN(parseInt(a));
}

function sum(a, b) {
  if (isNumber(a) || isNumber(b)) {
    throw new TypeError();
  }
  return a+b;
}

module.exports = sum;
