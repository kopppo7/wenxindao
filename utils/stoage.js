export const setLoginInfo = (para)=>{
  wx.setStorageSync('loginInfo', para)
}
export const getLoginInfo = () =>{
  return wx.getStorageSync('loginInfo');
}
export const setStoreConfigList = (para)=>{
  wx.setStorageSync('userConfigList', para)
}
export const getStoreConfigList = () =>{
  return wx.getStorageSync('userConfigList');
}