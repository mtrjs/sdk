interface IPlugin {
    name: string;
    apply(instance: Reporter): void;
    send: Sender;
}
// sync: 是否是同步模式
type Sender = (data: IData[], sync?: boolean) => Promise<boolean>;
interface ReporterConfig {
    // 应用 ID
    appId: string;
    // 上报环境
    env: string;
    // 上报地址
    dsn: string;
    plugins?: IPlugin[];
    debug?: boolean;
    // 上报任务缓存数量, default: 10
    maxTasks?: number;
}
/**
 * 公共参数
 *
 * @interface IBaseData
 */
interface IBaseData extends IPlatformBaseData {
    // 应用 id
    app_id: string;
    app_env: string;
    trace_id: string;
    // 版本
    version?: string;
    // sdk 信息
    sdk: {
        version: string;
    };
    // 时间戳
    t?: number;
    count?: number;
}
interface IPlatformBaseData {
    ua?: string;
}
interface LData extends IPlatformBaseData {
    // 事件 id
    eid: string;
    hash?: string;
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
    env: string;
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
        hash?: string | undefined;
        l: Record<string, any>;
        ua?: string | undefined;
        app_id: string;
        app_env: string;
        trace_id: string;
        version?: string | undefined;
        sdk: {
            version: string;
        };
        t: number;
        count?: number | undefined;
    };
}
interface Config$0 {
    // 储存任务满 maxTasks 则消费
    maxTasks: number;
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
    maxTasks: number;
    client: Reporter;
    // 周期上报时间间隔
    cycleTime: number;
    // 去重缓冲 map
    cache: Map<string, Task>;
    constructor(config: Config$0);
    /**
     * 任务消费
     *
     * @param {boolean} [clear] 是否清空
     * @return {*}
     * @memberof Schedule
     */
    consume(clear?: boolean): Promise<void>;
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
declare class Event {
    event: Map<string, any>;
    maxListener: number;
    constructor();
    on(type: string, fn: Function): void;
    once(type: string, fn: Function): void;
    emit<T>(type: string, params: T): void;
    setMaxListeners(count: number): void;
    listeners(type: string): any;
    removeAllListener(type: string): void;
    removeListener(type: string, listener: Function): void;
}
declare module EventWrapper {
    export { Event };
}
import EventEmitter = EventWrapper.Event;
/**
 * Core 实例
 *
 * @export
 * @class Reporter
 */
declare class Reporter {
    // 事件中心
    $hook: EventEmitter;
    // 实例配置
    config: ReporterConfig;
    // 数据包装器
    builder: Builder;
    // 事件上报中心
    schedule: Schedule;
    constructor(config: ReporterConfig);
    init(): void;
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
/**
 * 浏览器端插件
 *
 * @export
 * @class Browser
 */
declare class Browser implements IPlugin {
    name: string;
    client: Reporter;
    apply(client: Reporter): void;
    /**
     * 接口上报数据
     *
     * @param {IData[]} data
     * @param {boolean} [sync=false]
     * @return {*}
     * @memberof Browser
     */
    send(data: IData[], sync?: boolean): Promise<boolean>;
    /**
     * 内部使用的report方法, 用来注入一些插件内公共参数
     *
     * @param {ReportParams} body
     * @memberof Browser
     */
    report(body: ReportParams): void;
    /**
     * XHR劫持
     *
     * @return {*}
     * @memberof Browser
     */
    overrideXHR(): void;
    /**
     * fetch 劫持
     *
     * @return {*}
     * @memberof Browser
     */
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
    hijackConsole(): void;
    /**
     * 运行时性能计算
     *
     * @memberof Browser
     */
    runTimePerformance(): void;
}
export { Reporter as default, Browser };
