import { LocalStorageService } from '../utils/LocalStorageService.js';

class FolderStore {
  #folders;
  #storage;

  constructor() {
    this.#storage = new LocalStorageService('folder');
    this.#folders = this.#storage.getAllItems();
  }

  get folders() {
    return [...this.#folders];
  }

  getFolderById(id) {
    return this.#folders.find((folder) => folder.id === id);
  }

  addFolder(entity) {
    this.#folders.push(entity);
    this.#storage.setItem(entity);
  }

  removeFolder(id) {
    this.#folders = this.#folders.filter((folder) => folder.id !== id);
    this.#storage.removeItem(id);
  }

  updateFoldersFromStorage() {
    this.#folders = this.#storage.getAllItems();
  }
}

export default new FolderStore();
