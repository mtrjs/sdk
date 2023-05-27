import Reporter from './reporter';
import { IData, Sender } from './type';
import logger from '../lib/logger';

export interface Config {
  // 储存任务满 maxTasks 则消费
  maxTasks: number;
  client: Reporter;
}

export interface Task {
  id: number;
  data: IData;
}

let id = 0;

/**
 * 任务中心
 *
 * @export
 * @class Schedule
 */
export class Schedule {
  tasks: Task[];

  maxTasks: number;

  client: Reporter;

  // 周期上报时间间隔
  cycleTime: number;

  // 去重缓冲 map
  cache: Map<string, Task>;

  constructor(config: Config) {
    this.client = config.client;
    this.tasks = [];
    this.maxTasks = config.maxTasks;
    this.cycleTime = 8;
    this.cache = new Map();

    setInterval(() => {
      this.consume(true);
    }, this.cycleTime * 1000);
  }

  /**
   * 任务消费
   *
   * @param {boolean} [clear] 是否清空
   * @return {*}
   * @memberof Schedule
   */
  async consume(clear?: boolean) {
    if (!clear && this.tasks.length < this.maxTasks) return;
    const runTasks = this.tasks.slice(0, this.maxTasks);
    this.tasks = this.tasks.slice(this.maxTasks);
    const data = runTasks.map(({ data }) => data);

    if (!data.length) return;
    try {
      await this.send(data);
      setTimeout(() => {
        this.consume();
      }, 1000);
    } catch (error) {
      // this.tasks.push(...runTasks);
    }
  }

  /**
   *储存一个延时任务
   *
   * @param {IData} data
   * @memberof Schedule
   */
  push(data: IData) {
    const task = { id: ++id, data };
    this.tasks.push(task);
    this.consume();
  }

  /**
   * 向插件发送 send 事件
   *
   * @param {IData[]} data
   * @memberof Schedule
   */
  send(data: IData[]) {
    this.client.$hook.emit('send', (send: Sender) => {
      logger.info('send 任务发送: 数据', data);
      return send(data).then((res) => {
        logger.info('send 成功!');
        return res;
      });
    });
  }

  /**
   * 清空任务
   *
   * @memberof Schedule
   */
  async clear() {
    this.consume(true);
  }

  /**
   * 无需等待, 立即上报一个任务
   *
   * @param {IData} data
   * @return {*}
   * @memberof Schedule
   */
  immediate(data: IData) {
    return this.send([data]);
  }
}
