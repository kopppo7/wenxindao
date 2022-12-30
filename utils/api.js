import config from 'config.js';
import http from 'http.js';

function handleURL(url) {
    return config.getDomain + url;
}

// 接口地址命名加前缀 url，接口导出变量加前缀 api

// 登录相关

// 小程序登陆
export const appletsLogin = function (params) {
    return http.post(handleURL('/appletsLogin'), params);
};
// 解密手机号
export const decodePhone = function (params) {
  return http.post(handleURL('/decodePhone'), params);
};
// 同步小程序用户信息
export const updateUserMsg = function (params) {
    return http.post(handleURL('/updateUserMsg'), params);
};

// 获取当前登录人信息
export const getUserMsg = function (params) {
    return http.get(handleURL('/getUserMsg'), params);
};

// 用户退出
export const userLoginOut = function (params) {
    return http.get(handleURL('/userLoginOut'), params);
};

// 登录发送验证码
export const sendCode = function (params) {
    return http.get(handleURL('/sendCode'), params);
};

// 修改手机号绑定发送验证码
export const sendCodeForUpdate = function (params) {
    return http.get(handleURL('/sendCodeForUpdate'), params);
};

// 手机号登录
export const phoneLogin = function (params) {
    return http.post(handleURL('/phoneLogin'), params);
};

// 修改当前手机号
export const updatePhone = function (params) {
    return http.post(handleURL('/updatePhone'), params);
};

// 更改用户IM基础信息
export const updateImMsg = function (params) {
    return http.get(handleURL('/updateImMsg'), params);
};

//查询我的订单
export const findByOrderList = function (params) {
  return http.post(config.getOrder+'/findByOrderList',params);
}
//查询我的动态
export const findMyTrends = function (params) {
  return http.post(handleURL('/my/mytrends'),params);
}
//查询我的动态 每日调频 生命探索 主题派对
export const findMyUser = function (params) {
  return http.post(handleURL('/my/findByLogCountForUser'),params);
}
//根据id查询每日调频详情
export const findByFmOne = function (id) {
  return http.get(handleURL('/askfm/findByFmOne?id='+id));
}
//查询我的动态 删除
export const deleteMyUser = function (params) {
  return http.post(handleURL('/my/deleteLogForId'),params);
}
//查询公开的动态
export const findPublicTrends = function (params) {
  return http.post(handleURL('/my/publictrends'),params);
}
//查询反馈分类
export const getHelpTypeList = function () {
  return http.get(handleURL('/help/getHelpTypeList'));
}
//查询反馈列表
export const getHelpList = function (typeId) {
  return http.get(handleURL('/help/getHelpList?typeId='+typeId));
}
//新建反馈
export const addFeedback = function (data){
  return http.post(handleURL('/help/addFeedback'),data);
}
//查询反馈详情
export const getHelpOne = function (id) {
  return http.get(handleURL('/help/getHelpOne?id='+id));
}
// 生命探索&主题派对
export const getCateList = function (category) {
  return http.get(handleURL('/category/list?category='+category));
}
// 生命探索&主题派对 列表数据
export const getCateDataList = function (data) {
  return http.post(handleURL('/probe/probeList'),data);
}
// 生命探索&主题派对 支付
export const getPayProbe = function (data) {
  return http.post(config.getOrder+'/payProbe',data);
}
// 生命探索详情
export const getProDetail = function (id) {
  return http.get(handleURL('/probe/probeInfo?id='+id));
}
// 生命探索详情 评价列表
export const getProEvaList = function (data) {
  return http.post(handleURL('/probe/evaluateList'),data);
}
// 生命探索详情 提交评价
export const submitScore = function (data) {
    return http.post(handleURL('/probe/insertEvaluate'),data);
}
// 生命探索详情 获取继续探索id
export const getExpId = function (data) {
  return http.post(handleURL('/userprobe/init'),data);
}
// 生命继续探索详情 
export const getProExpDetail = function (data) {
  return http.post(handleURL('/userprobe/readInfo'),data);
}
// 生命继续探索 提交答案
export const submitContent = function (data) {
  return http.post(handleURL('/userprobe/answer'),data);
}
// 生命探索 抽取X张卡牌
export const cardRandom = function (data) {
  return http.post(handleURL('/userprobe/card/random'),data);
}
// 首页流
export const indexFlow = function (data) {
  return http.post(handleURL('/my/flow'),data);
}
// 发起裂变
export const sendAskInvite = function (id) {
  return http.get(handleURL('/askInvite/sendAskInvite?id='+id));
}
// 发起裂变
export const findInviteById = function (id) {
  return http.post(handleURL('/askInvite/findInviteById'),{id:id});
}