import { Builder } from './builder';
import { Schedule } from './schedule';
import { IPlugin, ReporterConfig, ReportParams } from './type';
import Emittery from 'emittery';

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
  $hook!: Emittery;
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

    this.schedule = new Schedule({ maxPool, client: this });

    // @ts-ignore
    this.$hook = new Emittery();

    // 插件注册
    this.registerPlugins(plugins);

    // 事件注册
    this.addListeners();

    // 唤起 init 事件
    this.$hook?.emit('init', {});
  }
  /**
   * 插件注册
   *
   * @private
   * @param {IPlugin[]} plugins
   * @return {*}
   * @memberof Reporter
   */
  private registerPlugins(plugins: IPlugin[]) {
    if (!Array.isArray(plugins)) return;
    plugins.map((plugin) => {
      return plugin.apply(this);
    });
  }
  /**
   * 挂在事件
   *
   * @private
   * @memberof Reporter
   */
  private addListeners() {
    // 接收插件上报事件, 将任务插入调度器
    this.$hook?.on('report', ({ data, runTime }: ReportParams) => {
      console.log('report 事件触发, 数据:', data);
      const pkgData = this.builder?.build(data);
      if (!pkgData) return;
      if (!runTime || runTime === 'delay') {
        this.schedule?.push(pkgData);
      } else if (runTime === 'immediately') {
        this.schedule?.immediate(pkgData);
      }
    });
  }

  getReportParams() {
    return {
      url: this.config.dsn + '/v1/report',
      method: 'POST',
      headers: {},
    };
  }

  getTasks() {
    return this.schedule.tasks;
  }

  getConfig() {
    return this.config;
  }
}
