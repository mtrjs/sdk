import { Eid, ExceptionType, RequestType } from './constant';
import { IData, IPlugin, LData, ReportParams, Sender } from '../core/type';
import Reporter from '../core/reporter';
import { Task } from '../core/scheduler';
import { getHash } from '../lib/helper';
import { onFCP, onCLS, onFID, onLCP, onTTFB } from 'web-vitals';

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

interface IError extends Event {
  colno?: string;
  filename?: string;
  lineno?: string;
  message?: string;
  error?: Error;
  name?: string;

  target: (EventTarget & { src?: string }) | null;
}

const indicators = [
  'navigationStart',
  'unloadEventStart',
  'unloadEventEnd',
  'navigationStart',
  'redirectStart',
  'redirectEnd',
  'fetchStart',
  'domainLookupStart',
  'domainLookupEnd',
  'connectStart',
  'secureConnectionStart',
  'connectEnd',
  'requestStart',
  'responseStart',
  'responseEnd',
  'domLoading',
  'domInteractive',
  'domContentLoadedEventEnd',
  'domContentLoadedEventStart',
  'domComplete',
  'loadEventStart',
  'loadEventEnd',
];

function formatTiming(timing: IPerformanceTimingV2) {
  const t: Record<string, any> = {
    redirectCount: timing.redirectCount,
  };

  indicators.forEach((key) => {
    t[key] = Number((timing[key as keyof IPerformanceTimingV2] || 0).toFixed(2));
  });

  return t;
}
/**
 * 往上报数据中注入 hash 值
 *
 * @param {LData} data
 * @return {*}
 */
function injectHash(data: LData) {
  const { eid, l } = data;

  let hash;
  if (eid === Eid['js-exception']) {
    const { name = '', stack = '', message = '', colno = '', filename = '', lineno = '' } = l;
    hash = getHash(name + stack + message + colno + lineno + filename);
  } else if (eid === Eid['resource-exception']) {
    const { src } = l;
    hash = getHash(src);
  }

  return hash;
}

/**
 * 浏览器端插件
 *
 * @export
 * @class Browser
 */
export class Browser implements IPlugin {
  name = 'Browser';

  client!: Reporter;

  apply(client: Reporter) {
    this.client = client;

    if (!window && !document) return;

    client.$hook.on('init', () => {
      this.timing();
      this.listenError();
      this.promiseError();
      this.overrideFetch();
      this.overrideXHR();
      this.hijackConsole();
      // this.runTimePerformance();
    });

    client.$hook.on('send', (report: (s: Sender) => Promise<any>) => {
      requestIdleCallback(() => report(this.send.bind(this)));
    });

    // 特殊处理, 刷新或者离开页面前保证缓存的数据能够上报
    document.addEventListener('visibilitychange', () => {
      const tasks = client.getTasks();
      if (!tasks.length) return;
      const data = tasks.map(({ data }: Task) => data);
      this.send(data, true);
    });
  }

  /**
   * 接口上报数据
   *
   * @param {IData[]} data
   * @param {boolean} [sync=false]
   * @return {*}
   * @memberof Browser
   */
  send(data: IData[], sync = false) {
    const { url, method } = this.client.getReportParams();
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (typeof navigator.sendBeacon === 'function') {
      return Promise.resolve(navigator.sendBeacon(url, formData));
    }
    if (typeof fetch === 'function') {
      return fetch(url, { method, keepalive: true }).then(() => {
        return true;
      });
    }
    return new Promise<boolean>((r, j) => {
      const XHR = new XMLHttpRequest();
      XHR.addEventListener('load', function () {
        r(true);
      });
      XHR.addEventListener('error', function () {
        j();
      });
      XHR.open(method, url, !sync);
      XHR.send(formData);
    });
  }

  /**
   * 内部使用的report方法, 用来注入一些插件内公共参数
   *
   * @param {ReportParams} body
   * @memberof Browser
   */
  report(body: ReportParams) {
    const { data } = body;
    const hash = injectHash(data);

    const { eid, l } = data;
    const ua = navigator.userAgent;

    this.client?.$hook.emit('report', {
      ...body,
      data: {
        eid,
        hash,
        l: {
          ...l,
          ua,
          href: window.location.href,
        },
      },
    });
  }

  /**
   * XHR劫持
   *
   * @return {*}
   * @memberof Browser
   */
  overrideXHR() {
    if (!XMLHttpRequest) return;
    const _this = this;

    const _open = XMLHttpRequest.prototype.open;
    const _send = XMLHttpRequest.prototype.send;

    const _setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.setRequestHeader = function (...args) {
      // 获取最后一个请求信息对象
      const headers = this.reporterCollect?.headers ?? {};
      const [header, value] = args || [];
      headers[header] = value;
      this.reporterCollect = {
        ...this.reporterCollect,
        headers,
      };

      // 调用原始 setRequestHeader 方法
      _setRequestHeader.apply(this, args);
    };

    XMLHttpRequest.prototype.open = function (...args: any) {
      const [method, url] = args as Parameters<XMLHttpRequest['open']>;
      const startTime = Date.now();

      this.reporterCollect = {
        ...this.reporterCollect,
        method,
        url: typeof url === 'string' ? url : url.toString(),
        startTime,
        type: RequestType.XHR,
      };
      _open.apply(this, args as Parameters<XMLHttpRequest['open']>);
    };
    XMLHttpRequest.prototype.send = function (...args) {
      const [body] = args || [];
      this.addEventListener('loadend', () => {
        const endTime = Date.now();
        const { status, statusText } = this;
        if (status > 200 || !status) {
          this.reporterCollect = {
            ...this.reporterCollect,
            endTime,
            status: String(status),
            statusText,
            body,
          };

          const { headers } = this.reporterCollect;
          _this.report({
            data: {
              eid: Eid['request-exception'],
              l: { ...this.reporterCollect, headers: JSON.stringify(headers) },
            },
          });
        }
      });

      _send.apply(this, args);
    };
  }

  /**
   * fetch 劫持
   *
   * @return {*}
   * @memberof Browser
   */
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
            Object.assign(reportData, {
              status: String(status),
              statusText,
              endTime,
            });
            _this.report({
              data: { eid: Eid['request-exception'], l: reportData },
            });
          }
          return result;
        })
        .catch((error: any) => {
          const endTime = Date.now();
          const { name, message, stack } = error;
          Object.assign(reportData, { name, message, stack });

          reportData.endTime = endTime;
          _this.report({
            data: {
              eid: Eid['request-exception'],
              l: reportData,
            },
          });

          return error;
        });
    };
  }

  /**
   * Js 异常捕捉
   *
   * @param {Reporter} client
   * @memberof Browser
   */
  listenError() {
    window.addEventListener(
      'error',
      (e: IError) => {
        const { type, error, message, colno, filename, lineno } = e;
        // js 报错捕捉
        if (type === 'error' && filename && colno && lineno) {
          this.report({
            data: {
              eid: Eid['js-exception'],
              l: {
                name: message,
                colno,
                message: error?.message,
                filename,
                lineno,
                stack: error?.stack,
              },
            },
          });
        } else {
          const src = e.target?.src;
          if (type === 'error' && src) {
            this.report({
              data: {
                eid: Eid['resource-exception'],
                l: {
                  src,
                },
              },
            });
          }
        }
      },
      true,
    );
  }

  /**
   * Promise 错误捕捉
   *
   * @param {Reporter} client
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

      if (reason instanceof Error) {
        const { name, stack, message } = reason;
        reportData.message = message;
        reportData.stack = stack || '';
        reportData.name = name;
      } else {
        reportData.message = reason;
        reportData.name = reason;
      }
      this.report({
        data: {
          eid: Eid['js-exception'],
          l: {
            type: ExceptionType.PROMISE,
            ...reportData,
          },
        },
      });
    });
  }

  /**
   * 性能数据采集
   *
   * @param {Reporter} client
   * @memberof Browser
   */
  timing() {
    // v2
    if (PerformanceObserver) {
      const observeTiming: Record<string, null | number> = {
        fcp: 0,
        lcp: 0,
        cls: null,
        ttfb: 0,
      };

      const navigationP = new Promise<IPerformanceTimingV2>((r) => {
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

      let loadPromiseUnLock = () => {};
      const loadPromise = new Promise<void>((r) => {
        loadPromiseUnLock = r;
      });

      onLCP(
        (metric) => {
          observeTiming.lcp = metric.value;
        },
        {
          reportAllChanges: true,
        },
      );

      const fcpP = new Promise<void>((r) => {
        onFCP((metric) => {
          observeTiming.fcp = metric.value;
          r();
        });
      });

      onCLS(
        (metric) => {
          observeTiming.cls = metric.value;
        },
        { reportAllChanges: true },
      );

      let fid: number | undefined;

      onFID((metric) => {
        fid = metric.value;
      });

      const ttfbP = new Promise<void>((r) => {
        onTTFB((metric) => {
          observeTiming.ttfb = metric.value;
          r();
        });
      });

      setTimeout(() => {
        loadPromiseUnLock();
      }, 12000);

      window.addEventListener('load', () => {
        loadPromiseUnLock();
      });

      Promise.all([navigationP, loadPromise, fcpP, ttfbP]).then(([navigation]) => {
        navigation = formatTiming(navigation);
        const { lcp, fcp, ttfb, cls } = observeTiming;
        this.report({
          runTime: 'immediately',
          data: {
            eid: Eid.performance,
            l: {
              ...navigation,
              lcp: lcp && Number(lcp.toFixed(2)),
              fcp: fcp && Number(fcp.toFixed(2)),
              fid: fid && Number(fid.toFixed(2)),
              cls: cls && Number(cls.toFixed(2)),
              ttfb: ttfb && Number(ttfb.toFixed(2)),
            },
          },
        });
      });
    } else {
      window.addEventListener('load', () => {
        const { navigationStart, unloadEventStart } = performance.timing;
        const { redirectCount } = performance.navigation;
        const startAt = Math.min(navigationStart, unloadEventStart) || 0;

        const originTiming: Record<string, any> = {
          ...performance.timing,
          ...performance.navigation,
        };

        const timing: Record<string, any> = {
          redirectCount,
        };

        indicators.forEach((key, index) => {
          if (originTiming[key] > 0) {
            originTiming[key] -= startAt;
          } else {
            originTiming[key] = index === 0 ? 0 : originTiming[indicators[index - 1]];
          }
          timing[key] = originTiming[key];
        });

        this.report({
          runTime: 'immediately',
          data: { eid: Eid.performance, l: timing },
        });
      });
    }
  }

  hijackConsole() {
    const _this = this;
    const _err = console.error;
    console.error = function (...args: Parameters<typeof _err>) {
      let messages = '';
      try {
        messages = JSON.stringify(
          args.map((arg) => {
            if (typeof arg === 'string') return arg;
            if (arg instanceof Error) return arg.message;
            return String(arg);
          }),
        );
      } catch (error) {
        /* empty */
      }

      _this.report({
        data: {
          eid: Eid['console-exception'],
          l: {
            messages,
            type: 'error',
          },
        },
      });
      _err.apply(this, args);
    };
  }

  /**
   * 运行时性能计算
   *
   * @memberof Browser
   */
  runTimePerformance() {
    let fpsStore: number[] = [];
    let memoryStore: MemoryInfo[] = [];

    const calFps = () => {
      let lastTime = 0;
      let frameCount = 0;

      const _calFps = (currentTime: number) => {
        if (lastTime === 0) {
          lastTime = currentTime;
        }

        frameCount++;

        if (currentTime - lastTime >= 1000) {
          const fps = frameCount;
          frameCount = 0;
          lastTime = currentTime;
          fpsStore.push(fps);
        }
        requestAnimationFrame(_calFps);
      };
      requestAnimationFrame(_calFps);
    };

    const calMemory = () => {
      setInterval(() => {
        const memory = performance?.memory;
        memory && memoryStore.push(memory);
      }, 1000);
    };

    window.addEventListener('load', () => {
      calFps();
      calMemory();
      setInterval(() => {
        if (!fpsStore.length) return;
        console.log(memoryStore);

        const fps = fpsStore.reduce((acc, cur) => acc + cur, 0) / fpsStore.length;
        fpsStore = [];
        memoryStore = [];

        this.report({
          data: {
            eid: Eid['runtime-performance'],
            l: {
              fps,
            },
          },
        });
      }, 8000);
    });
  }
}
