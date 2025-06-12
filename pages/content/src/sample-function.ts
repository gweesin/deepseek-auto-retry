// 保存原生 XMLHttpRequest
const originalXHR = window.XMLHttpRequest;

const ignoredUrls = [
  '/version.txt',
  '/downloads/status.json',
  'https://gator.volces.com',
  '/create_pow_challenge',
  '/history_messages',
  '/fetch_page',
];

const isFailed = (response: string): boolean => {
  if (response.includes(`data: {"type":"error","content":"Server busy, please try again later."}`)) {
    return true;
  }

  return false;
};

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const coveredXHR = () => {
  // 重写 XMLHttpRequest
  class InterceptedXHR extends originalXHR {
    private readonly _listeners: Record<string, EventListenerOrEventListenerObject[]>;
    private _method?: string;
    private _url?: string;

    constructor() {
      super();
      this._listeners = {};
      // console.log('coveredXHR constructor called');
    }

    addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
      // console.log(`Adding event listener for type: ${type}`, listener);
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(listener);
      super.addEventListener(type, listener);
    }

    // 关键：重写 open 方法
    open(method: string, url: string) {
      // console.log(`Opening XHR with method: ${method}, url: ${url}`);
      this._method = method;
      this._url = url;
      super.open(method, url);
    }

    // 关键：重写 send 方法
    send(body?: Document | XMLHttpRequestBodyInit | null): void {
      this.addEventListener('load', async () => {
        if (this.readyState === 4) {
          const url = this._url!;
          if (ignoredUrls.some(u => url.includes(u))) {
            return;
          }

          if (isFailed(this.responseText)) {
            console.log(`Intercepted XHR failed`);
            await sleep(1000);
            const generateEls = document.querySelectorAll('#重新生成');
            const lastEl = generateEls.item(generateEls.length - 1);
            lastEl.closest('div')!.click();
          }
          console.log(this._url, this.responseText);
        }
      });
      super.send(body);
    }
  }

  // 覆盖原生 XHR 对象
  window.XMLHttpRequest = InterceptedXHR;
};

export const sampleFunction = () => {
  coveredXHR();
};
