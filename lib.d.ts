interface XMLHttpRequest {
  reporterCollect: Record<string, any>;
}

interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface Performance {
  memory: MemoryInfo;
}

interface Document {
  prerendering: boolean;
}

interface Window {}

interface Navigator {
  connection?: {
    effectiveType?: string;
  };
}

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
