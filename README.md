# webview-monitor

前端页面用户事件监听

## 引入

复制 `dist/monitor.min.js` 文件到项目中，在 html 文件中引入：

```
<script src="${lib_path}/monitor.min.js"></script>
```

## 使用示例

```
// 实例化Monitor，注册pagestay(页面停留事件)、elementinput(输入事件)、elementclick(点击事件)三个事件
// 配置pagestay事件时间间隔为3秒
var monitor = new Monitor({
  events: ["pagestay", "elementinput", "elementclick"],
  pagestay: {
    timeout: 3000
  }
});

// 监听pagestay事件，每隔三秒触发
monitor.on("pagestay", function(options) {
  console.log("stay", options);

  /**
  封装后端需要的数据，发送到后端
  var data = Object.assign({}, options, {
    event: "pagestay",
    platform: 微信公众号平台,
    userId: 用户ID,
    ...
  });
  $.ajax({ method: "POST", url: "/event", data: data })
  */
});

// 监听elementiput事件，输入框输入的时候触发
monitor.on("elementinput", function(options) {
  console.log("input", options);

  /**
  获取输入框的属性
  var input = options.event.target;
  var name = input.dataset.name;
  var data = Object.assign({}, options, {
    event: "elementinput",
    ...
  });
  $.ajax({ method: "POST", url: "/event", data: data })
  */
});

// 监听elementclick事件，元素点击的时候触发
monitor.on("elementclick", function(options) {
  console.log("click", options);

  /**
  过滤按钮
  var target = options.event.target;
  if (target.dataset.type === "button") {
    var name = target.dataset.name;
    var data = Object.assign({}, options, {
      event: "elementclick",
      ...
    });
    $.ajax({ method: "POST", url: "/event", data: data })
  }
  */
});
```

## API

**new Monitor(options?: any)**

构造函数， `options` 可以为空，配置如下：

```
{
  // 需要注册的页面事件，默认为空。如果不注册任何事件，实例化后监听对应的事件无效
  events?: string[],

  // 如果注册了页面停留事件，可以配置事件触发的时间间隔（单位毫秒）,默认间隔为1秒
  pagestay?: {
    timeout: number
  }
}
```

**monitor.on(event: string, callback: func)**

监听事件，如果在实例化的时候没有注册过需要监听的事件，那么此事件不会触发

```
event: 事件名称
callback: 事件处理函数，事件相关数据会做为第一个参数注入
```

**monitor.off(event: string, callback: func)**

解除事件的监听函数

```
event: 事件名称
callback: 事件处理函数
```

## Monitor Events

`Monitor` 目前支持 6 种监控事件：

```
pageload: 页面加载事件，仅页面加载完成时触发一次

pagestay: 页面停留事件，根据设置的间隔时间timeout，从页面加载完成一直到页面关闭，每隔timeout毫秒触发一次

elementfocus: 元素获取焦点事件

elementblur: 元素失去焦点事件

elementclick: 元素点击事件

elementinput: 文本框输入事件
```

## 事件监听函数参数注入

`Monitor Events` 在触发事件的时候会自动将封装好的事件数据注入到事件处理函数中。

```
公共数据，所有事件数据都包含以下字段：
{
  title: string, // 页面名称
  url: string,  // 页面地址
}

pageload事件特有字段
{
  time: number, // 页面访问时间
}

pagestay事件特有字段
{
  startTime: number, // 页面访问时间
  time: number, // 停留事件触发时间
  duration: number, // 当前停留时长
}

elementfocus、elementblur、elementclick、elementinput事件特有字段
{
  event: Event, // HTML Dom事件对象
  time: number, // 事件触发时间
}
```

## 其他

- 统计页面停留时间可以监听 `pagestay` 事件，根据用户 `ID` 和 `startTime` 来标识一次访问记录，最大的 `duration` 则为页面停留时间
- 按钮元素的点击统计需要在 `elementclick` 事件处理函数中进行过滤
- 用户 ID，公众号等值可以在事件处理函数中封装
