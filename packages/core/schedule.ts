import Reporter from './index';
import { IData, Send } from './type';
import logger from '../lib/logger';

export interface Config {
  // 储存任务满 maxPool 则消费
  maxPool: number;
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
  maxPool: number;
  client: Reporter;

  constructor(config: Config) {
    this.client = config.client;
    this.tasks = [];
    this.maxPool = config.maxPool;
  }

  /**
   * 任务消费
   *
   * @param {boolean} [clear] 是否清空
   * @return {*}
   * @memberof Schedule
   */
  async consumer(clear?: boolean) {
    if (!clear && this.tasks.length < this.maxPool) return;
    const runTasks = this.tasks.slice(0, this.maxPool);
    this.tasks = this.tasks.slice(this.maxPool);
    const data = runTasks.map(({ data }) => data);
    try {
      await this.send(data);
      setTimeout(() => {
        this.consumer();
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
    this.consumer();
  }
  /**
   * 向插件发送 send 事件
   *
   * @param {IData[]} data
   * @memberof Schedule
   */
  send(data: IData[]) {
    this.client.$hook.emit('send', (send: Send) => {
      logger.log('send 任务发送: 数据', { data });
      return send(data).then((res) => {
        logger.log('send 成功!');
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
    this.consumer(true);
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
