import { time } from "./utils";

type PageViewOptions = {
  title: string,
  visitTime: number,
  stayTime: number
}

type EventCallback = (options: any) => void;

type EventHandlers = {
  [key: string]: EventCallback[]
}

type Props = {

} | void;
export default class Monitor {
  private _title: string = "";
  private _pageLoadTime: number = null;
  private _pageUnloadTime: number = null;
  private _eventHandlers: EventHandlers = {
    "pageload": [], // 页面加载事件
    "elementfocus": [], // 获取焦点事件
    "elementblur": [], // 失去焦点事件
    "elementclick": [], // 点击事件
    "elementinput": [], // 输入事件
  };

  constructor(props: Props) {
    this._title = document.title;
    this._onPageLoad();
    this._onElementClick();
    this._onElementInput();
  }

  on(event: string, callback: EventCallback) {
    if (this._eventHandlers[event] == null) {
      return console.warn("No such event");
    }
    this._eventHandlers[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (this._eventHandlers[event] == null) {
      return console.warn("No such event");
    }
    this._eventHandlers[event] = this._eventHandlers[event].filter((func: (options: any) => void) => {
      return func !== callback;
    })
  }

  _handleEvent(event: string, options: any) {
    this._eventHandlers[event].forEach((callback: EventCallback) => {
      callback(options);
    })
  }

  _onPageLoad() {
    window.addEventListener("load", () => {
      this._pageLoadTime = Date.now();
      const options = {
        title: this._title,
        time: this._pageLoadTime
      }
      this._handleEvent("pageload", options);
    })
  }

  _onElementClick() {
    document.addEventListener("click", e => {
      const options = {
        event: e,
        time: Date.now()
      };
      this._handleEvent("elementclick", options);
    })
  }

  _onElementInput() {
    document.addEventListener("input", e => {
      const options = {
        event: e,
        time: Date.now()
      };
      this._handleEvent("elementinput", options);
    })
  }
}