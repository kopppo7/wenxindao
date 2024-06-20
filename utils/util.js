
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const obj = {
    year,
    month,
    day,
    hour,
    minute,
    second,
    allTime: [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return obj
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

// 防抖
const debounce = (fn, wait) => {
  let timeout = null;
  return function() {
      let context = this;
      let args = arguments;
      if (timeout) clearTimeout(timeout);
      let callNow = !timeout;
      timeout = setTimeout(() => {
          timeout = null;
      }, wait);
      if (callNow) fn.apply(context, args);
  };
}

module.exports = {
  formatTime: formatTime,
  debounce
};