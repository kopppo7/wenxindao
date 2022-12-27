import config from '../utils/config';
import http from '../utils/http.js';

function handleURL (url) {
    return config.getDomain + url;
}


// (生命探索&主题派对）分类
export const categoryList = function (data) {
    return http.get(handleURL('/category/list'), data);
};
// 查询主题派对列表
export const getAskPartyList = function (data) {
    return http.post(handleURL('/askParty/getAskPartyList'), data);
};

// 查看主题派对详情
export const findByAskPartyOne = function (data) {
    return http.get(handleURL('/askParty/findByAskPartyOne'), data);
};

// 获取某个生命探索下的评价
export const evaluateList = function (data) {
    return http.post(handleURL('/probe/evaluateList'), data);
};

// 新增评价
export const insertEvaluate = function (data) {
    return http.post(handleURL('/probe/insertEvaluate'), data);
};
// 更改用户IM基础信息
export const updateImMsg = function (data) {
    return http.post(handleURL('/updateImMsg'), data);
};

//创建房间
export const createBaoRoom = function (params) {
    return http.post(handleURL('/room/createBaoRoom'), params);
}

//打开包房房间匹配模式
export const openBaoRoomMate = function (params) {
    return http.get(handleURL('/room/openBaoRoomMate'), params);
}
//开始游戏
export const startPlayRoom = function (params) {
    return http.post(handleURL('/room/startPlayRoom'), params);
}
//匹配游戏
export const matchingPlay = function (params) {
    return http.post(handleURL('/room/matchingPlay'), params);
}
//修改房主
export const updateOwner = function (params) {
    return http.post(handleURL('/room/updateOwner'), params);
}
//解散房间
export const dissolveGroup = function (params) {
    return http.post(handleURL('/room/dissolveGroup'), params);
}
//点赞队友
export const likeTeammate = function (params) {
    return http.post(handleURL('/room/likeTeammate'), params);
}
//投诉队友
export const complaintUser = function (params) {
    return http.post(handleURL('/room/complaintUser'), params);
}//退出房间
export const quitRoom = function (params) {
    return http.post(handleURL('/room/quitRoom'), params);
}
//邀请好友进入房间
export const inviteFriendsRoom = function (params) {
    return http.post(handleURL('/room/inviteFriendsRoom'), params);
}
//游戏房间踢人
export const kickingPlayer = function (params) {
    return http.post(handleURL('/room/kickingPlayer'), params);
}
// 主题派对 支付
export const getPayParty = function (data) {
  return http.post(config.getOrder+'/payParty',data);
}
// 主题派对 匹配游戏
export const roomMatchingPlay = function (id) {
  return http.get(handleURL('/room/matchingPlay?id='+id));
}