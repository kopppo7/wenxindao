export const setLoginInfo = (para)=>{
  wx.setStorageSync('loginInfo', para)
}
export const getLoginInfo = () =>{
  return wx.getStorageSync('loginInfo');
}
export const setUserConfigList = (para)=>{
  wx.setStorageSync('userConfigList', para)
}
export const getUserConfigList = () =>{
  return wx.getStorageSync('userConfigList');
}