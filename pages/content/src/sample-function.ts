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

const getRetryIcon = () => {
  const specialSvgPath = document.querySelector(
    `[d="M12 .5C18.351.5 23.5 5.649 23.5 12S18.351 23.5 12 23.5.5 18.351.5 12 5.649.5 12 .5zm-.225 4.8a.7.7 0 0 0-.528.224.703.703 0 0 0-.213.517.84.84 0 0 0 .056.304c.037.09.087.168.146.235l.809.831a.782.782 0 0 0-.147-.01 1.112 1.112 0 0 0-.157-.012 4.69 4.69 0 0 0-2.436.673 5.26 5.26 0 0 0-1.82 1.832c-.456.763-.685 1.617-.685 2.56 0 .966.232 1.845.696 2.639A5.33 5.33 0 0 0 9.36 16.99c.779.464 1.648.697 2.606.697.95 0 1.816-.233 2.595-.697a5.326 5.326 0 0 0 1.875-1.886 5.03 5.03 0 0 0 .696-2.606.716.716 0 0 0-.247-.55.754.754 0 0 0-.55-.236.78.78 0 0 0-.573.235.731.731 0 0 0-.236.551 3.46 3.46 0 0 1-.483 1.808c-.314.539-.741.97-1.28 1.292a3.44 3.44 0 0 1-1.797.482 3.44 3.44 0 0 1-1.797-.482 3.679 3.679 0 0 1-1.291-1.292 3.521 3.521 0 0 1-.472-1.808c0-.659.158-1.258.472-1.797a3.588 3.588 0 0 1 1.29-1.28 3.44 3.44 0 0 1 1.798-.484c.164 0 .3.008.404.023l-1.111 1.112a.722.722 0 0 0-.225.528c0 .21.07.386.213.528a.718.718 0 0 0 1.033-.012l2.246-2.246a.66.66 0 0 0 .203-.527.753.753 0 0 0-.203-.54l-2.223-2.268a.847.847 0 0 0-.247-.169.62.62 0 0 0-.28-.067z"]`,
  );
  if (specialSvgPath) {
    return specialSvgPath.closest('div')!;
  }

  const generateEls = document.querySelectorAll('#重新生成');
  const lastEl = generateEls.item(generateEls.length - 1);
  return lastEl.closest('div')!;
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
            getRetryIcon().click();
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
