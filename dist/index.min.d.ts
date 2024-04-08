interface ReporterConfig {
    // 应用 ID
    appId: string;
    // 上报环境
    env: string;
    // 上报服务端地址
    dsn: string;
    // 上报任务缓存数量, default: 20
    maxTasks?: number;
    // 作品 ID
    contentId?: string;
    // 作品名称
    contentName?: string;
    // 用户ID
    userId?: string;
    // 用户昵称
    userName?: string;
}
/**
 * 公共参数
 *
 * @interface IBaseData
 */
interface IBaseData {
    // 应用 id
    appId: string;
    appEnv: string;
    cid?: string;
    cname?: string;
    traceId: string;
    ua?: string;
    href?: string;
    uid?: string;
    uname?: string;
}
interface LData {
    // 事件 id
    eid: string;
    hash?: string;
    t?: number;
    [k: string]: any;
}
// delay: 任务缓存, immediately: 立即执行
type RunTime = "delay" | "immediately";
interface ReportParams {
    data: LData | LData[];
    // 执行时机
    runTime?: RunTime;
}
interface Task {
    id: number;
    data: LData;
    count: number;
}
declare class Storage {
    tasks: Task[];
    maxTasks: number;
    constructor(props: {
        maxTasks: number;
    });
    /**
     * 往缓冲区 push 任务
     *
     * @param {LData} data
     * @return {*}
     * @memberof Storage
     */
    push(data: LData | LData[]): boolean;
    /**
     * 取出缓冲区的任务
     *
     * @param {number} n
     * @return {*}
     * @memberof Storage
     */
    pop(n: number): Task[];
    getSize(): number;
}
interface Config {
    // 每次消费任务个数上限
    maxTasks: number;
    client: Reporter;
    storage: Storage;
}
/**
 * 任务中心
 *
 * @export
 * @class Schedule
 */
declare class Scheduler {
    maxTasks: number;
    client: Reporter;
    storage: Storage;
    // 周期上报时间间隔
    cycleTime: number;
    constructor(config: Config);
    /**
     * 任务消费
     *
     * @param {boolean} [clear] 是否清空
     * @return {*}
     * @memberof Schedule
     */
    consume(): Promise<void>;
}
declare class Reporter {
    static instance: Reporter;
    config: ReporterConfig;
    baseData: IBaseData;
    // 数据缓冲区
    storage: Storage;
    scheduler: Scheduler;
    reportedEids: Set<string>;
    constructor(config: ReporterConfig);
    /**
     * 初始化方法
     *
     * @return {*}
     * @memberof Reporter
     */
    init(): boolean;
    /**
     * 实例暴露给外部自定义上报的方法
     *
     * @param {ReportParams} { data, runTime }
     * @return {*}
     * @memberof Reporter
     */
    report({ data, runTime }: ReportParams): void;
    /**
     * 无需等待, 立即上报一个任务
     *
     * @param {IData} data
     * @return {*}
     * @memberof Schedule
     */
    private immediate;
    /**
     * 更新配置,同时更新已上报数据
     * @param config
     */
    updateConfig(config: {
        contentId?: string;
        contentName?: string;
        userId?: string;
        userName?: string;
    }): void;
    /**
     * 接口上报数据
     *
     * @param {any} data
     * @param {boolean} [sync=false]
     * @return {*}
     * @memberof Browser
     */
    send(data: any, config?: {
        url?: string;
    }, sync?: boolean): Promise<boolean>;
    /**
     * XHR劫持
     *
     * @return {*}
     * @memberof Browser
     */
    private overrideXHR;
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
     * 性能计算入口
     * @returns
     */
    timing(): void;
    /**
     * 首屏性能数据采集
     *
     * @param {Reporter} client
     * @memberof Browser
     */
    navigationTiming(): void;
    /**
     * 资源性能数据
     *
     * @memberof Reporter
     */
    resourceTiming(): void;
}
export { Reporter as default };
