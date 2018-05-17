// Finds first elem with substr and removes all preceding elems
function read(textArr, substr, start = 0, offset = 0) {
  const index = textArr.findIndex((str, idx) => idx >= start && str.includes(substr));
  return textArr.slice(index + offset);
}

module.exports = {
  read
};
