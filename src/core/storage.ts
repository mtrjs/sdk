import { LData, Task } from './type';

let id = 0;

export default class Storage {
  tasks: Task[];

  maxTasks: number;

  constructor(props: { maxTasks: number }) {
    this.tasks = [];
    this.maxTasks = props.maxTasks;
  }

  /**
   * 往缓冲区 push 任务
   *
   * @param {LData} data
   * @return {*}
   * @memberof Storage
   */
  push(data: LData | LData[]) {
    if (Array.isArray(data)) {
      const tasks = data.map(d => ({ id: ++id, data: d, count: 1 }));
      this.tasks = this.tasks.concat(tasks);
    } else {
      const task = { id: ++id, data, count: 1 };
      this.tasks.push(task);
    }
    if (this.tasks.length >= this.maxTasks) return true;
    return false;
  }

  /**
   * 取出缓冲区的任务
   *
   * @param {number} n
   * @return {*}
   * @memberof Storage
   */
  pop(n: number) {
    const tasks = this.tasks.slice(0, n);
    this.tasks = this.tasks.slice(n);
    return tasks;
  }

  getSize() {
    return this.tasks.length;
  }
}
