function updataMembers(len,arr){
  var len2 = arr.length;
  var memArr = arr;
  if (len2 < len) {
    for (let i = len; i > len2; i--) {
      const element = {};
      memArr.push(element)
    }
  }
  return memArr
}

module.exports = {
  updataMembers,
};