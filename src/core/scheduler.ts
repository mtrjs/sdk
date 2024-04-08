import Reporter from './reporter';
import Storage from './storage';

export interface Config {
  // 每次消费任务个数上限
  maxTasks: number;
  client: Reporter;
  storage: Storage;
}

/**
 * 任务中心
 *
 * @export
 * @class Schedule
 */
export default class Scheduler {
  maxTasks: number;

  client: Reporter;

  storage: Storage;

  // 周期上报时间间隔
  cycleTime: number;

  constructor(config: Config) {
    const { client, maxTasks, storage } = config;
    this.client = client;
    this.maxTasks = maxTasks;
    this.storage = storage;
    this.cycleTime = 5;

    setInterval(() => {
      this.consume();
    }, this.cycleTime * 1000);
  }

  /**
   * 任务消费
   *
   * @param {boolean} [clear] 是否清空
   * @return {*}
   * @memberof Schedule
   */
  async consume() {
    const tasks = this.storage.pop(this.maxTasks);

    const data = tasks.map(({ data }) => data);
    if (!data.length) return;
    try {
      await this.client.send(
        { ...this.client.baseData, list: data },
        {
          url: `${this.client?.config?.dsn}/report`,
        },
      );
      setTimeout(() => {
        this.consume();
      }, 100);
    } catch (error) {
      console.log(error);
    }
  }
}
