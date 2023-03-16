/**
 * 公共参数
 *
 * @interface IBaseData
 */
interface IBaseData {
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
  t?: number
}

interface IPlugin {
  name: string;
  apply(instance: Monitor): void;
}

interface MonitorOptions {
  appId: string;
  plugins?: IPlugin[];
}

interface LData {
  // 类型
  type: string;
  l: Record<string, any>;
}

type IData = IBaseData & LData;

type Send = (url: string, data: IData[]) => Promise<void>;
