type Send = (url: string, data: { data: IData[] }) => Promise<boolean>;

interface MonitorConfig {
  appId: string;
  dsn: string;
  plugins?: IPlugin[];
  debug?: boolean;
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
}

interface IPlatformBaseData {
  ua?: string;
  // 事件 id
  eid?: string;
  // 时间戳
  t?: number;
}

interface LData extends IPlatformBaseData {
  l: Record<string, string | number>;
}

type IData = IBaseData & LData;
