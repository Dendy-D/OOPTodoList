import { LocalStorageService } from '../utils/LocalStorageService.js';

class TaskStore {
  #tasks;
  #storage;

  constructor() {
    this.#storage = new LocalStorageService('task');
    this.#tasks = this.#storage.getAllItems();
  }

  get tasks() {
    return [...this.#tasks];
  }

  getTasksOfFolder(folderId) {
    return [...this.#tasks].filter((task) => task.folderId === folderId);
  }

  getTaskById(id) {
    return this.#tasks.find((task) => task.id === id);
  }

  removeTask(id) {
    this.#tasks = this.#tasks.filter((task) => task.id !== id);
    this.#storage.removeItem(id);
  }

  removeAllFolderTasks(folderId) {
    this.#tasks = this.#tasks.filter((task) => {
      if (task.folderId === folderId) {
        this.#storage.removeItem(task.id);
        return;
      }
      return task;
    });
  }

  addTask(task) {
    this.#tasks.push(task);
    this.#storage.setItem(task);
  }

  updateTasksFromStorage() {
    this.#tasks = this.#storage.getAllItems();
  }
}

export default new TaskStore();
