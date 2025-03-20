import { TaskModel } from './TaskModel.js';

export class RecurringTaskModel extends TaskModel {
  constructor(id, title, description) {
    super(id, title, description);
    this.isRecurring = true;
  }
}
