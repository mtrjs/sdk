import pkg from '../../package.json';
import { IBaseData, LData } from './type';

interface Config {
  appId: string;
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
    const { appId } = config;
    const traceId = guid();
    this.cache = new Map();

    this.baseData = {
      appId,
      traceId,
      sdk: {
        version: pkg.version,
      },
    };
  }

  build(data: LData) {
    return { t: +new Date(), ...this.baseData, ...data };
  }
}
