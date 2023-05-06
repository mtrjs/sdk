import { IBaseData, LData } from './type';
import pkg from '../../package.json';
import { guid } from '../lib/helper';

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
export class Builder {
  baseData: IBaseData;

  cache: Map<string, string>;

  constructor(config: Config) {
    const { appId, env } = config;
    const traceId = guid();
    this.cache = new Map();

    this.baseData = {
      app_id: appId,
      app_env: env,
      trace_id: traceId,
      sdk: {
        version: pkg.version,
      },
    };
  }

  build(data: LData) {
    return { t: +new Date(), ...this.baseData, ...data };
  }
}
