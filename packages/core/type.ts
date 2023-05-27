import Reporter from './reporter';

export interface IPlugin {
  name: string;
  apply(instance: Reporter): void;
  send: Sender;
}

// sync: 是否是同步模式
export type Sender = (data: IData[], sync?: boolean) => Promise<boolean>;

export interface ReporterConfig {
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
export interface IBaseData extends IPlatformBaseData {
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

export interface IPlatformBaseData {
  ua?: string;
}

export interface LData extends IPlatformBaseData {
  // 事件 id
  eid: string;
  l: Record<string, any>;
}

export type IData = IBaseData & LData;

// delay: 任务缓存, immediately: 立即执行
export type RunTime = 'delay' | 'immediately';

export interface ReportParams {
  data: LData;
  // 执行时机
  runTime?: RunTime;
}
