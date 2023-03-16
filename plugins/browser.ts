import Monitor from '../core';
import { ReportType } from '../lib/constant';

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

/**
 * 浏览器端插件
 *
 * @export
 * @class Browser
 */
export class Browser {
  private options: Options;
  name: string = 'Browser';
  constructor(options?: Options) {
    this.options = options || {};
  }

  apply(instance: Monitor) {
    instance.$hook.on('init', () => {
      console.log('init 事件触发')
      this.timing(instance);
      this.jsError(instance);
      this.promiseError(instance);
    });

    instance.$hook.on('send', (report) => {
      report(this.send);
    });

    window.addEventListener('unload',()=>{
      instance.$hook.emit('report',{
        
      })
    })
  }

  send(url: string, data: IData) {
    if (typeof navigator.sendBeacon === 'function') {
      return Promise.resolve(navigator.sendBeacon(url, JSON.stringify(data)));
    } else {
    }
  }
  /**
   * Js 异常捕捉
   *
   * @param {Monitor} instance
   * @memberof Browser
   */
  jsError(instance: Monitor) {
    window.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
      instance.$hook.emit('report', {
        type: ReportType.ERROR,
        l: {
          source,
          lineno,
        },
      });
    };
  }
  /**
   * Promise 错误捕捉
   *
   * @param {Monitor} instance
   * @memberof Browser
   */
  promiseError(instance: Monitor) {
    window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
      const { reason } = e;
      console.log(e);
    });
  }

  /**
   * 性能数据采集
   *
   * @param {Monitor} instance
   * @memberof Browser
   */
  timing(instance: Monitor) {
    let timing: IPerformanceTimingV2 = {};
    // v2
    if (!!PerformanceObserver) {
      const perfObserver = (entries: PerformanceObserverEntryList) => {
        entries.getEntries().forEach((entry) => {
          const { entryType } = entry;
          if (entryType === 'navigation') {
            const t = entry.toJSON() as IPerformanceTimingV2;
            Object.assign(timing, t);
          }
        });
      };

      const observer = new PerformanceObserver(perfObserver);
      observer.observe({
        entryTypes: ['navigation'],
      });
    } else {
      Object.assign(timing, performance.navigation, performance.timing);
    }
    instance.$hook.emit('report', {
      type: ReportType.PERFORMANCE,
      l: timing,
    });
  }
}
