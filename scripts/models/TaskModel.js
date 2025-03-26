import { setReadOnlyProperty } from '../utils/setReadOnlyProperty.js';

export class TaskModel {
  constructor({ id, title, description, folderId }) {
    setReadOnlyProperty(this, 'id', id);
    this.title = title;
    this.description = description;
    this.isCompleted = false;
    this.isImportant = false;
    this.folderId = folderId;
    setReadOnlyProperty(this, 'createdAt', new Date());
  }

  complete() {
    this.isCompleted = true;
  }

  uncomplete() {
    this.isCompleted = false;
  }

  prioritize() {
    this.isImportant = true;
  }

  deprioritize() {
    this.isImportant = false;
  }

  static validate(taskName) {
    const errors = [];

    if (!taskName) errors.push({ name: 'taskName', description: 'Task name is required.' });

    return errors;
  }
}
