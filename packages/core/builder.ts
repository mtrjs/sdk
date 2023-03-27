// import { generateRandom } from '@tubit/common/lib/random';
import pkg from '../../package.json';
import { IBaseData, LData } from './type';

interface Config {
  appId: string;
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
    const traceId = 'generateRandom()';
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
