import { Builder } from './builder';
import { Schedule } from './schedule';
import { IPlugin, LData, ReporterConfig } from './type';
import { EventEmitter } from '@tubit/common/lib/events';

function assertConfig(config: ReporterConfig) {
  if (!config) {
    throw new Error('缺少 SDK 配置信息');
  }

  if (!config.dsn) {
    throw new Error('缺少 SDK dns 配置信息');
  }

  if (!config.appId) {
    throw new Error('缺少 appId 应用 ID');
  }
}

/**
 * Core 实例
 *
 * @export
 * @class Reporter
 */
export default class Reporter {
  // 事件中心
  $hook!: EventEmitter;
  // 实例配置
  config!: ReporterConfig;
  // 数据包装器
  builder!: Builder;
  // 事件上报中心
  schedule!: Schedule;

  init(config: ReporterConfig) {
    assertConfig(config);

    this.config = config;

    const { plugins = [], appId, maxPool = 10 } = config;

    this.builder = new Builder({ appId });

    this.schedule = new Schedule({ max: maxPool, client: this });

    // @ts-ignore
    this.$hook = new EventEmitter();

    // 插件注册
    this.registerPlugins(plugins);

    // 事件注册
    this.addListeners();

    // 唤起 init 事件
    this.$hook?.emit('init', {});
  }

  private registerPlugins(plugins: IPlugin[]) {
    if (!Array.isArray(plugins)) return;
    plugins.map((plugin) => {
      return plugin.apply(this);
    });
  }

  private addListeners() {
    // 接收插件上报事件, 将任务插入调度器
    this.$hook?.on('report', (data: LData) => {
      console.log('report 事件触发, 数据:', data);
      const pkgData = this.builder?.build(data);
      pkgData && this.schedule?.push(pkgData);
    });
  }
}
