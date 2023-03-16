import { generateRandom } from '@tubit/common/lib/random';
import pkg from '../package.json';

interface Config {
  appId: string;
}

/**
 * 数据包装器, 公共参数注入, 转换
 *
 * @export
 * @class Builder
 */
export class Builder {
  baseData: IBaseData;

  constructor(config: Config) {
    const { appId } = config;
    const traceId = generateRandom();
    this.baseData = {
      appId,
      traceId,
      sdk: {
        version: pkg.version,
      },
    };
  }

  build(data: LData) {
    const { l, type } = data;
    return Object.assign({ l, type, t: +new Date() }, this.baseData);
  }
}
