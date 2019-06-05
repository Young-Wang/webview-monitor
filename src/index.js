import Monitor from "./monitor";
; (function (global) {
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = Monitor
  } else if (typeof define === 'function' && (define.cmd || define.amd)) {
    define(Monitor);
  } else {
    global.Monitor = Monitor;
  }
})(typeof window !== 'undefined' ? window : global);