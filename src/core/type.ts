import Reporter from './reporter';

export interface IPlugin {
  name: string;
  apply(instance: Reporter): void;
  send: Sender;
}

// sync: 是否是同步模式
export type Sender = (
  data: any,
  config?: {
    url?: string;
  },
  sync?: boolean,
) => Promise<boolean>;

export interface ReporterConfig {
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
export interface IBaseData {
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

export interface LData {
  // 事件 id
  eid: string;
  hash?: string;
  t?: string;
  [k: string]: any;
}

export type IData = IBaseData & LData;

// delay: 任务缓存, immediately: 立即执行
export type RunTime = 'delay' | 'immediately';

export interface ReportParams {
  data: LData | LData[];
  // 执行时机
  runTime?: RunTime;
}

export interface User {
  id?: string;
  name?: string;
  [k: string]: any;
}

export interface Task {
  id: number;
  data: LData;
  count: number;
}

export type NavigationTimingPolyfillEntry = IPerformanceTimingV2 &
  PerformanceResourceTiming & { activationStart: number };
