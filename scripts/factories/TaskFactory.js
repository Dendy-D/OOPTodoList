import { TaskModel } from '../models/TaskModel.js';
import { RecurringTaskModel } from '../models/RecurringTaskModel.js';
import { DeadlineTaskModel } from '../models/DeadlineTaskModel.js';
import { TaskTypes } from '../types/TaskTypes.js';

export class TaskFactory {
  static createTask(title, description = '', dueDate = null, type = 'normal') {
    const task = { id: crypto.randomUUID(), title, description };
    switch (type) {
      case TaskTypes.RECURRING:
        return new RecurringTaskModel(task);
      case TaskTypes.DEADLINE:
        return new DeadlineTaskModel({ ...task, dueDate });
      default:
        return new TaskModel(task);
    }
  }
}
