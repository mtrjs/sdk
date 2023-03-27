import Monitor from './index';
import { IData, Send } from './type';

export interface Config {
  // 储存任务满 max 则消费
  max: number;
  client: Monitor;
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
  max: number;
  client: Monitor;
  pending: boolean = false;

  constructor(config: Config) {
    this.client = config.client;
    this.tasks = [];
    this.max = config.max || 10;
  }

  // 消费任务
  consumer() {
    if (this.tasks.length < this.max || this.pending) return;
    const { dsn } = this.client.config;

    this.pending = true;
    this.client.$hook.emit('send', (send: Send) => {
      const datas = this.tasks.slice(0, this.max).map(({ data }) => data);
      console.log('send 任务发送: 数据', { data: datas });
      send(dsn + '/v1/report', { data: datas })
        .then(() => {
          console.log('send 成功, 清除成功任务');
          this.tasks = this.tasks.slice(this.max);
          this.consumer();
        })
        .finally(() => {
          this.pending = false;
        });
    });
  }

  // 储存任务
  push(data: IData) {
    const task = { id: ++id, data };
    this.tasks.push(task);
    this.consumer();
  }

  // 清空任务并消费
  clear() {
    this.consumer();
  }

  // 立即上报
  immediate(report: Function) {}
}
