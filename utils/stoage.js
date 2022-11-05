export const setLoginInfo = (para)=>{
  wx.setStorageSync('loginInfo', para)
}
export const getLoginInfo = () =>{
  return wx.getStorageSync('loginInfo');
}