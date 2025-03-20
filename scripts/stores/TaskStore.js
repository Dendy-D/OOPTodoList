class TaskStore {
  #tasks = [];

  get tasks() {
    return [...this.#tasks];
  }

  getTaskById(id) {}
  removeTask(id) {}
  addTask() {}

  #saveTasks() {}
}
