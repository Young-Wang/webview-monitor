const vConsole = require("vconsole");
import Monitor from "./monitor";
const Vue = (window as any).Vue;
new vConsole();

const monitor = new Monitor();
monitor.on("pageload", (options: any) => {
  console.log(options);
})
monitor.on("pageload", (options: any) => {
  console.log("another", options);
})
const callback = (options: any) => {
  console.log("input", options)
}
monitor.on("elementinput", callback);
monitor.on("elementinput", (options: any) => {
  console.log("input", options)
  monitor.off("elementinput", callback);
})
monitor.on("elementclick", (options: any) => {
  console.log("click", options);
});


const app = new Vue({
  el: "#app",
  data: () => {
    return {
      bindType: true,
      userNo: true,
      userPassword: true
    }
  },
  methods: {
    phoneQuery: () => {
      console.log("click");
    },
    passwordQuery: () => { },
    queryOne: () => { },
    gitPullOne: () => {

    },
    queryTwo: () => { },
    gitPullTwo: () => { }
  }
});
