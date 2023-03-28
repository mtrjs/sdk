import Emittery from "emittery";
interface IPlugin {
    name: string;
    apply(instance: Reporter): void;
    send: Send;
}
type Send = (data: IData[]) => Promise<boolean>;
interface ReporterConfig {
    // 应用 ID
    appId: string;
    // 上报地址
    dsn: string;
    plugins?: IPlugin[];
    debug?: boolean;
    // 上报任务缓存数量, default: 10
    maxPool?: number;
}
/**
 * 公共参数
 *
 * @interface IBaseData
 */
interface IBaseData extends IPlatformBaseData {
    // 应用 id
    appId: string;
    traceId: string;
    // 版本
    version?: string;
    // sdk 信息
    sdk: {
        version: string;
    };
    // 时间戳
    t?: number;
}
interface IPlatformBaseData {
    ua?: string;
}
interface LData extends IPlatformBaseData {
    // 事件 id
    eid: string;
    l: Record<string, any>;
}
type IData = IBaseData & LData;
// delay: 任务缓存, immediately: 立即执行
type RunTime = "delay" | "immediately";
interface ReportParams {
    data: LData;
    // 执行时机
    runTime?: RunTime;
}
interface Config {
    appId: string;
}
/**
 * 数据处理
 *
 * @export
 * @class Builder
 */
declare class Builder {
    baseData: IBaseData;
    cache: Map<string, string>;
    constructor(config: Config);
    build(data: LData): {
        eid: string;
        l: Record<string, any>;
        ua?: string | undefined;
        appId: string;
        traceId: string;
        version?: string | undefined;
        sdk: {
            version: string;
        };
        t: number;
    };
}
interface Config$0 {
    // 储存任务满 maxPool 则消费
    maxPool: number;
    client: Reporter;
}
interface Task {
    id: number;
    data: IData;
}
/**
 * 任务中心
 *
 * @export
 * @class Schedule
 */
declare class Schedule {
    tasks: Task[];
    maxPool: number;
    client: Reporter;
    constructor(config: Config$0);
    /**
     * 任务消费
     *
     * @param {boolean} [clear] 是否清空
     * @return {*}
     * @memberof Schedule
     */
    consumer(clear?: boolean): Promise<void>;
    /**
     *储存一个延时任务
     *
     * @param {IData} data
     * @memberof Schedule
     */
    push(data: IData): void;
    /**
     * 向插件发送 send 事件
     *
     * @param {IData[]} data
     * @memberof Schedule
     */
    send(data: IData[]): void;
    /**
     * 清空任务
     *
     * @memberof Schedule
     */
    clear(): Promise<void>;
    /**
     * 无需等待, 立即上报一个任务
     *
     * @param {IData} data
     * @return {*}
     * @memberof Schedule
     */
    immediate(data: IData): void;
}
/**
 * Core 实例
 *
 * @export
 * @class Reporter
 */
declare class Reporter {
    // 事件中心
    $hook: Emittery;
    // 实例配置
    config: ReporterConfig;
    // 数据包装器
    builder: Builder;
    // 事件上报中心
    schedule: Schedule;
    init(config: ReporterConfig): void;
    /**
     * 插件注册
     *
     * @private
     * @param {IPlugin[]} plugins
     * @return {*}
     * @memberof Reporter
     */
    private registerPlugins;
    /**
     * 挂在事件
     *
     * @private
     * @memberof Reporter
     */
    private addListeners;
    getReportParams(): {
        url: string;
        method: string;
        headers: {};
    };
    getTasks(): Task[];
    getConfig(): ReporterConfig;
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
interface Options {
}
/**
 * 浏览器端插件
 *
 * @export
 * @class Browser
 */
declare class Browser implements IPlugin {
    private options;
    name: string;
    client: any;
    constructor(options?: Options);
    apply(client: any): void;
    send(data: IData[]): Promise<boolean>;
    report(body: ReportParams): void;
    overrideXHR(): void;
    overrideFetch(): void;
    /**
     * Js 异常捕捉
     *
     * @param {Reporter} client
     * @memberof Browser
     */
    listenError(): void;
    /**
     * Promise 错误捕捉
     *
     * @param {Reporter} client
     * @memberof Browser
     */
    promiseError(): void;
    /**
     * 性能数据采集
     *
     * @param {Reporter} client
     * @memberof Browser
     */
    timing(): void;
    formatTiming(timing: IPerformanceTimingV2): {
        unloadEventStart: number | undefined;
        unloadEventEnd: number | undefined;
        navigationStart: number | undefined;
        redirectStart: number | undefined;
        redirectEnd: number | undefined;
        redirectCount: number | undefined;
        fetchStart: number | undefined;
        domainLookupStart: number | undefined;
        domainLookupEnd: number | undefined;
        connectStart: number | undefined;
        secureConnectionStart: number | undefined;
        connectEnd: number | undefined;
        requestStart: number | undefined;
        responseStart: number | undefined;
        responseEnd: number | undefined;
        domLoading: number | undefined;
        domInteractive: number | undefined;
        domContentLoadedEventEnd: number | undefined;
        domContentLoadedEventStart: number | undefined;
        domComplete: number | undefined;
        loadEventStart: number | undefined;
        loadEventEnd: number | undefined;
    };
}
export { Reporter as default, Browser };
