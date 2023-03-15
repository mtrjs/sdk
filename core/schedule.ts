import { serverUrl } from '../lib/constant';
import Monitor from './index';

interface Config {
  // 储存任务满 max 则消费
  max: number;
  client: Monitor;
}

/**
 * 任务中心
 *
 * @export
 * @class Schedule
 */
export class Schedule {
  private tasks: IData[];
  private max: number;
  private client: Monitor;
  private pending: boolean = false;

  constructor(config: Config) {
    this.client = config.client;
    this.tasks = [];
    this.max = config.max || 10;
  }

  consumer() {
    if (this.tasks.length < this.max || this.pending) return;
    this.pending = true;
    this.client.$hook.emit('send', (send: Send) => {
      const data = this.tasks.slice(0, this.max);
      console.log('send 任务发送: 数据', data);
      send(serverUrl, data)
        .then(() => {
          console.log('send 成功, 清除成功任务')
          this.tasks = this.tasks.slice(this.max);
          this.consumer();
        })
        .finally(() => {
          this.pending = false;
        });
    });
  }

  push(data: IData) {
    this.tasks.push(data);
    this.consumer();
  }

  immediate(report: Function) {}
}
