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
    const data = [...this.#tasks].filter((task) => task.folderId === folderId);
    const sortedData = data.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    const filteredData = sortedData.sort((a, b) => a.isCompleted - b.isCompleted);
    return filteredData;
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

  completeTask(id) {
    this.#tasks = this.#tasks.map((task) => {
      // add Model logic here
      if (task.id === id) {
        const updatedTask = { ...task, isCompleted: true };
        this.#storage.setItem(updatedTask);
        return updatedTask;
      }
      return task;
    });
  }

  unCompleteTask(id) {
    this.#tasks = this.#tasks.map((task) => {
      // add Model logic here
      if (task.id === id) {
        const updatedTask = { ...task, isCompleted: false };
        this.#storage.setItem(updatedTask);
        return updatedTask;
      }
      return task;
    });
  }

  updateTasksFromStorage() {
    this.#tasks = this.#storage.getAllItems();
  }

  getFolderById(folders, id) {
    return folders.filter((folder) => folder.id === id)[0];
  }
}

export default new TaskStore();
