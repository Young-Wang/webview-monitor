type EventCallback = (options: any) => void;

type EventHandlers = {
  [key: string]: EventCallback[]
}

type PageStay = {
  timeout: number,
}
type Props = {
  events?: string[],
  pagestay?: PageStay
} | void;

const DEFAULT_PAGESTAY: PageStay = {
  timeout: 1000
};
const DEFAULT_PROPS: Props = {
  events: [],
  pagestay: DEFAULT_PAGESTAY
};
export default class Monitor {
  private _url: string = "";
  private _title: string = "";
  private _baseOptions: any = null;
  private _pageLoadTime: number = null;
  private _events: string[] = null;
  private _pagestay: PageStay = null;
  private _eventHandlers: EventHandlers = {
    "pageload": [], // 页面加载事件
    "elementfocus": [], // 获取焦点事件
    "elementblur": [], // 失去焦点事件
    "elementclick": [], // 点击事件
    "elementinput": [], // 输入事件
    "pagestay": [], // 页面停留事件，每隔timeout时间触发一次
  };

  constructor(props: Props = DEFAULT_PROPS) {
    this._pagestay = { ...DEFAULT_PAGESTAY, ...((props as any).pagestay) };
    this._events = (props as any).events;
    this._title = document.title;
    this._url = location.href;
    this._baseOptions = {
      title: this._title,
      url: this._url
    };
    this._onPageLoad();
    this._hasRegisterEvent("elementclick") && this._onElementClick();
    this._hasRegisterEvent("elementinput") && this._onElementInput();
    this._hasRegisterEvent("elementfocus") && this._onElementFocus();
    this._hasRegisterEvent("elementblur") && this._onElementBlur();
  }

  _hasRegisterEvent(event: string) {
    return this._events.indexOf(event) > -1;
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
      callback({ ...this._baseOptions, ...options });
    })
  }

  _onPageLoad() {
    window.addEventListener("load", () => {
      this._pageLoadTime = Date.now();
      // 判断是否注册了页面加载事件
      if (this._hasRegisterEvent("pageload")) {
        const options = {
          title: this._title,
          time: this._pageLoadTime
        }
        this._handleEvent("pageload", options);
      }
      // 如果注册了页面停留事件，开始监听
      if (this._hasRegisterEvent("pagestay")) {
        const pagestayOptions = {
          title: this._title,
          startTime: this._pageLoadTime,
          time: this._pageLoadTime,
          duration: 0
        };
        this._handleEvent("pagestay", pagestayOptions);
        this._onPageStay();
      }
    })
  }

  _onPageStay() {
    setTimeout(() => {
      const time = Date.now();
      const startTime = this._pageLoadTime;
      const duration = time - startTime;
      const options = {
        title: this._title,
        startTime: startTime,
        time: time,
        duration: duration
      }
      this._handleEvent("pagestay", options);
      this._onPageStay();
    }, this._pagestay.timeout);
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

  // focus、blur事件不支持冒泡
  _onElementFocus() {
    document.addEventListener("focus", e => {
      const options = {
        event: e,
        time: Date.now()
      };
      this._handleEvent("elementfocus", options);
    }, true)
  }

  _onElementBlur() {
    document.addEventListener("blur", e => {
      const options = {
        event: e,
        time: Date.now()
      };
      this._handleEvent("elementblur", options);
    }, true);
  }
}