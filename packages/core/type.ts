import Reporter from './reporter';

export interface IPlugin {
  name: string;
  apply(instance: Reporter): void;
  send: Send;
}

export type Send = (url: string, data: { data: IData[] }) => Promise<boolean>;

export interface ReporterConfig {
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
export interface IBaseData extends IPlatformBaseData {
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

export interface IPlatformBaseData {
  ua?: string;
}

export interface LData extends IPlatformBaseData {
  // 事件 id
  eid: string;
  l: Record<string, string | number>;
}

export type IData = IBaseData & LData;
