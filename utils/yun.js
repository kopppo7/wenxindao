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
function formatMsgList (list) {
  let botArr = []
  let topArr = []
  let all = {
    topArr:[],
    botArr:[]
  }
  if (list.length > 0) {
    list.forEach(item => {
      if (item.isBotMes) {
        botArr.push(item)
      } else {
        topArr.push(item)
      }
    })
  }
  all.topArr = topArr
  all.botArr = botArr
  return all
}
module.exports = {
  updataMembers,
  dismissTeamDone,
  formatMsgList
};