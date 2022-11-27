function updataMembers (len, arr) {
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
function dismissTeamDone (error, obj) {
  console.log(error);
  console.log(obj);
  console.log('解散群' + (!error ? '成功' : '失败'));
}
module.exports = {
  updataMembers,
  dismissTeamDone,
};