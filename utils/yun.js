function dismissTeamDone(error, obj) {
    console.log(error);
    console.log(obj);
    console.log('解散群' + (!error?'成功':'失败'));
  }

module.exports = {
    dismissTeamDone,
};