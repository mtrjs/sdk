import { EventEmitter } from '@tubit/common/lib/events';
import { Builder } from './builder';
import { Schedule } from './schedule';
import { Browser } from '../plugins/browser';

export { Browser };

/**
 * Core 实例
 *
 * @export
 * @class Monitor
 */
export default class Monitor {
  // 事件中心
  public $hook: EventEmitter;
  // 实例配置
  public options: MonitorOptions;
  // 数据包装器
  private builder: Builder;
  // 事件上报中心
  private schedule: Schedule;

  constructor(options: MonitorOptions) {
    this.options = options;

    const { plugins = [], appId } = options;

    this.$hook = new EventEmitter();
    this.builder = new Builder({ appId });

    this.schedule = new Schedule({ max: 10, client: this });

    // 插件注册
    this.registerPlugins(plugins);

    // 派发事件
    this.addListeners();

    // 唤起 init 事件
    this.$hook.emit('init', {});
  }

  private registerPlugins(plugins: IPlugin[]) {
    if (!Array.isArray(plugins)) return;
    plugins.map((plugin) => {
      return plugin.apply(this);
    });
  }

  private addListeners() {
    // 接收插件上报事件, 将任务插入调度器
    this.$hook.on('report', (data: LData) => {
      console.log('report 事件触发, 数据:', data);
      const pkgData = this.builder.build(data);
      pkgData && this.schedule.push(pkgData);
    });
  }
}
