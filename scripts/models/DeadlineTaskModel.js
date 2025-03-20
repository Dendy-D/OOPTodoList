import { TaskModel } from './TaskModel';

export class DeadlineTaskModel extends TaskModel {
  constructor(id, title, description, dueDate) {
    super(id, title, description);
    this.dueDate = dueDate;
    this.isOverdue = false;
  }

  checkOverdue() {}
}
