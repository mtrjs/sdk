import { Builder } from './builder';
import { Schedule } from './scheduler';
import { IPlugin, ReporterConfig, ReportParams } from './type';
import EventEmitter from '../lib/Event';
import logger from '../lib/logger';

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

  constructor(config: ReporterConfig) {
    assertConfig(config);
    this.config = config;
  }

  init() {
    const { plugins = [], appId, maxTasks = 10, env } = this.config;

    this.builder = new Builder({ appId, env });

    this.schedule = new Schedule({ maxTasks, client: this });

    this.$hook = new EventEmitter();

    // 插件注册
    this.registerPlugins(plugins);

    // 事件注册
    this.addListeners();

    // 唤起 init 事件
    this.$hook?.emit('init', {});
    logger.info('sdk init');
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

  private addListeners() {
    // 接收插件上报事件, 将任务插入调度器
    this.$hook?.on('report', ({ data, runTime }: ReportParams) => {
      const _runTime = runTime || 'delay';
      const pkgData = this.builder?.build(data);
      if (!pkgData) return;
      if (_runTime === 'delay') {
        this.schedule?.push(pkgData);
      } else if (_runTime === 'immediately') {
        this.schedule?.immediate(pkgData);
      }
    });
  }

  getReportParams() {
    return {
      url: `${this.config.dsn}/v1/report`,
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
