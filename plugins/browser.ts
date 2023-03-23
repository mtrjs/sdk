import Monitor from '../core';
import { ErrorType, ReportType, RequestType } from '../lib/constant';

// V2 是相对时间, V1 是时间戳
interface IPerformanceTimingV2 {
  // unload 事件开始时间
  unloadEventStart?: number;
  // unload 事件结束时间
  unloadEventEnd?: number;

  // unload 上一个文档后的时间, 如无上一个文档, 则等于 fetchStart
  navigationStart?: number;

  // 重定向开始时间, 直到 HTTP 响应结束, 如果重定向非同源, 则为 0
  redirectStart?: number;
  // 重定向结束时间, 如果重定向非同源, 则为 0
  redirectEnd?: number;
  // 重定向次数, 如果重定向非同源, 则为 0
  redirectCount?: number;

  // 浏览器发起请求的时间
  fetchStart?: number;

  // DNS 解析开始时间, 存在缓存时等于 fetchStart
  domainLookupStart?: number;
  // DNS 解析完成时间, 存在缓存时等于 fetchStart
  domainLookupEnd?: number;

  // 浏览器与服务器开始连接时间, 持久连接时等于 fetchStart
  connectStart?: number;
  // https 连接开始时间
  secureConnectionStart?: number;
  // 浏览器与服务器连接建立时间, 持久连接时等于 fetchStart
  connectEnd?: number;

  // 发起 HTTP 请求时间
  requestStart?: number;
  // 浏览器开始接收响应时间, 无论是从服务端还是缓存接收
  responseStart?: number;
  // 浏览器接收响应数据完成时间, 或者连接关闭时间
  responseEnd?: number;

  // 浏览器开始解析第一批 HTML 节点
  domLoading?: number;
  // 浏览器完成对所有 HTML 的解析并且 DOM 构建完成的时间点, 包含同步的 css js 资源
  domInteractive?: number;

  // HTML 加载完成时间, 无需等待样式, 图片, 子资源加载
  domContentLoadedEventEnd?: number;
  // HTML 加载开始时间
  domContentLoadedEventStart?: number;

  // 文档加载完成, 资源加载完成, readyState 切换为 complete
  domComplete?: number;

  // load 事件开始时间
  loadEventStart?: number;
  // load 事件结束时间
  loadEventEnd?: number;
}

interface Options {}

interface IError extends Event {
  colno?: string;
  filename?: string;
  lineno?: string;
  message?: string;
  error?: Error;
  name?: string;
}

/**
 * 浏览器端插件
 *
 * @export
 * @class Browser
 */
export class Browser implements IPlugin {
  private options: Options;
  name: string = 'Browser';
  client: Monitor | undefined;

  constructor(options?: Options) {
    this.options = options || {};
  }

  apply(client: Monitor) {
    this.client = client;

    if (!window) return;

    client.$hook.on('init', () => {
      console.log('init 事件触发');
      this.timing();
      this.listenError();
      this.promiseError();
      this.overrideFetch();
      this.overrideXHR();
    });

    client.$hook.on('send', (report) => {
      report(this.send);
    });

    window.addEventListener('unload', () => {
      client.$hook.emit('report', {});
    });
  }

  send(url: string, body: { data: IData[] }) {
    const { data } = body;
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (typeof navigator.sendBeacon === 'function') {
      return Promise.resolve(navigator.sendBeacon(url, formData));
    } else {
      return new Promise<boolean>((r, j) => {
        const XHR = new XMLHttpRequest();
        XHR.addEventListener('load', function () {
          r(true);
        });
        XHR.addEventListener('error', function () {
          j();
        });
        XHR.open('POST', url);
        XHR.send(formData);
      });
    }
  }

  report(data: { eid: string; l: Record<string, any> }) {
    const { eid, l } = data;
    const ua = navigator.userAgent;
    this.client?.$hook.emit('report', {
      eid,
      l: {
        ...l,
        ua,
      },
    });
  }

  overrideXHR() {
    const monitor = this.client;
    if (!XMLHttpRequest) return;
    const _open = XMLHttpRequest.prototype.open;
    const _send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (...args: any) {
      const [method, url] = args;
      const startTime = Date.now();

      this.monitorCollect = {
        ...this.monitorCollect,
        method,
        url,
        startTime,
        type: RequestType.XHR,
      };
      _open.apply(this, args);
    };
    XMLHttpRequest.prototype.send = function (...args) {
      this.addEventListener('loadend', () => {
        const endTime = Date.now();
        const { status, statusText } = this;

        if (status > 200) {
          this.monitorCollect = {
            ...this.monitorCollect,
            endTime,
            status,
            statusText,
          };

          monitor?.$hook.emit('report', {
            eid: '1001',
            l: this.monitorCollect,
          });
        }
      });

      _send.apply(this, args);
    };
  }

  overrideFetch() {
    if (typeof window.fetch !== 'function') {
      return;
    }
    const _this = this;

    const originFetch = window.fetch;

    window.fetch = (...args) => {
      const startTime = Date.now();
      const url = args[0];
      const config = args[1];
      const { method = 'GET' } = config || {};
      const reportData: Record<string, string | number> = {
        url: url as string,
        startTime,
        method,
        type: RequestType.fetch,
      };

      return originFetch
        .apply(window, args)
        .then((result) => {
          const { status, statusText } = result;
          if (status && status > 300) {
            const endTime = Date.now();
            Object.assign(reportData, { status, statusText, endTime });
            _this.report({ eid: '1001', l: reportData });
          }
          return result;
        })
        .catch((error: any) => {
          const endTime = Date.now();
          const { name, message, stack } = error;
          Object.assign(reportData, { name, message, stack });

          reportData.endTime = endTime;
          _this.report({
            eid: '1001',
            l: reportData,
          });

          return error;
        });
    };
  }

  /**
   * Js 异常捕捉
   *
   * @param {Monitor} client
   * @memberof Browser
   */
  listenError() {
    window.addEventListener(
      'error',
      (e: IError) => {
        let { type, error, colno, filename, lineno, message } = e;
        if (type === 'error' && filename && colno && lineno) {
          if (!message) {
            message = error?.message || '';
          }

          this.report({
            eid: '1003',
            l: {
              colno,
              message,
              filename,
              lineno,
              stack: error?.stack,
              type: ErrorType.JS,
            },
          });
        }
      },
      true,
    );
  }
  /**
   * Promise 错误捕捉
   *
   * @param {Monitor} client
   * @memberof Browser
   */
  promiseError() {
    window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
      const { reason } = e;
      const reportData = {
        message: '',
        stack: '',
        name: '',
      };

      if (typeof reason === 'string') {
        reportData.message = reason;
      } else if (reason instanceof Error) {
        const { name, stack, message } = reason;
        reportData.message = message;
        reportData.stack = stack || '';
        reportData.name = name;
      }
      this.report({
        eid: '1003',
        l: {
          type: ErrorType.PROMISE,
          ...reportData,
        },
      });
    });
  }

  /**
   * 性能数据采集
   *
   * @param {Monitor} client
   * @memberof Browser
   */
  timing() {
    let timing: IPerformanceTimingV2 = {};
    // v2
    if (!!PerformanceObserver) {
      const fcpP = new Promise<number>((r, j) => {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              r(entry.startTime);
            }
          });
        });

        observer.observe({ type: 'paint', buffered: true });
      });

      const lcpP = new Promise<number>((r, j) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          r(lastEntry.startTime);
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      });

      const navigationP = new Promise<IPerformanceTimingV2>((r, j) => {
        const perfObserver = (entries: PerformanceObserverEntryList) => {
          entries.getEntries().forEach((entry) => {
            const { entryType } = entry;
            if (entryType === 'navigation') {
              const t = entry.toJSON() as IPerformanceTimingV2;
              r(t);
            }
          });
        };
        const observer = new PerformanceObserver(perfObserver);
        observer.observe({ entryTypes: ['navigation'] });
      });

      Promise.all([navigationP, lcpP, fcpP]).then(([navigation, lcp, fcp]) => {
        const timing = this.formatTiming(navigation);
        this.report({
          eid: '1000',
          l: {
            ...timing,
            lcp: Number(lcp.toFixed(2)),
            fcp: Number(fcp.toFixed(2)),
          },
        });
      });
    } else {
      window.addEventListener('load', () => {
        let {
          unloadEventStart,
          unloadEventEnd,
          navigationStart,
          redirectStart,
          redirectEnd,
          fetchStart,
          domainLookupStart,
          domainLookupEnd,
          connectStart,
          secureConnectionStart,
          connectEnd,
          requestStart,
          responseStart,
          responseEnd,
          domLoading,
          domInteractive,
          domContentLoadedEventEnd,
          domContentLoadedEventStart,
          domComplete,
          loadEventStart,
          loadEventEnd,
        } = performance.timing;

        const { redirectCount } = performance.navigation;
        const startAt = navigationStart || 0;

        unloadEventStart = unloadEventStart >= startAt ? unloadEventStart - startAt : 0;
        unloadEventEnd = unloadEventEnd >= startAt ? unloadEventEnd - startAt : unloadEventStart;
        redirectStart = redirectStart >= startAt ? redirectStart - startAt : unloadEventEnd;
        redirectEnd = redirectEnd >= startAt ? redirectEnd - startAt : redirectStart;
        fetchStart = fetchStart >= startAt ? fetchStart - startAt : redirectEnd;
        domainLookupStart = domainLookupStart >= startAt ? domainLookupStart - startAt : fetchStart;
        domainLookupEnd = domainLookupStart >= startAt ? domainLookupStart - startAt : domainLookupStart;
        connectStart = connectStart >= startAt ? connectStart - startAt : domainLookupEnd;
        secureConnectionStart = secureConnectionStart >= startAt ? secureConnectionStart - startAt : connectStart;
        connectEnd = connectEnd >= startAt ? connectEnd - startAt : secureConnectionStart;
        requestStart = requestStart ? requestStart - startAt : connectEnd;
        responseStart = responseStart >= startAt ? responseStart - startAt : requestStart;
        responseEnd = responseEnd >= startAt ? responseEnd - startAt : responseStart;
        domLoading = domLoading >= startAt ? domLoading - startAt : responseEnd;
        domInteractive = domInteractive >= startAt ? domInteractive - startAt : domLoading;
        domContentLoadedEventStart =
          domContentLoadedEventStart >= startAt ? domContentLoadedEventStart - startAt : domInteractive;
        domContentLoadedEventEnd =
          domContentLoadedEventEnd >= startAt ? domContentLoadedEventEnd - startAt : domContentLoadedEventStart;
        domComplete = domComplete >= startAt ? domComplete - startAt : domContentLoadedEventEnd;
        loadEventStart = loadEventStart >= startAt ? loadEventStart - startAt : domComplete;
        loadEventEnd = loadEventEnd >= startAt ? loadEventEnd - startAt : loadEventStart;
        timing = {
          navigationStart: 0,
          unloadEventStart,
          unloadEventEnd,
          redirectStart,
          redirectEnd,
          fetchStart,
          domainLookupStart,
          domainLookupEnd,
          connectStart,
          secureConnectionStart,
          connectEnd,
          requestStart,
          responseStart,
          responseEnd,
          domLoading,
          domInteractive,
          domContentLoadedEventEnd,
          domContentLoadedEventStart,
          domComplete,
          loadEventStart,
          loadEventEnd,
          redirectCount,
        };
        this.report({ eid: '1000', l: timing });
      });
    }
  }

  formatTiming(timing: IPerformanceTimingV2) {
    const {
      unloadEventStart,
      unloadEventEnd,
      navigationStart,
      redirectStart,
      redirectEnd,
      redirectCount,
      fetchStart,
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      secureConnectionStart,
      connectEnd,
      requestStart,
      responseStart,
      responseEnd,
      domLoading,
      domInteractive,
      domContentLoadedEventEnd,
      domContentLoadedEventStart,
      domComplete,
      loadEventStart,
      loadEventEnd,
    } = timing;
    const t = {
      unloadEventStart,
      unloadEventEnd,
      navigationStart,
      redirectStart,
      redirectEnd,
      redirectCount,
      fetchStart,
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      secureConnectionStart,
      connectEnd,
      requestStart,
      responseStart,
      responseEnd,
      domLoading,
      domInteractive,
      domContentLoadedEventEnd,
      domContentLoadedEventStart,
      domComplete,
      loadEventStart,
      loadEventEnd,
    };

    Object.entries(t).forEach(([key, value]) => {
      if (typeof value === 'number') {
        t[key as keyof IPerformanceTimingV2] = Number(value.toFixed(2));
      } else {
        t[key as keyof IPerformanceTimingV2] = value || 0;
      }
    });
    return t;
  }
}
