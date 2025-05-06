import { LocalStorageService } from '../utils/LocalStorageService.js';

class FolderStore {
  #folders;
  #storage;

  constructor() {
    this.#storage = new LocalStorageService('folder');
    this.#folders = this.#storage.getAllItems();
  }

  get folders() {
    const data = [...this.#folders];
    const sortedData = data.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    return sortedData;
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

  hasFolderWithName(title) {
    return this.#folders.some((folder) => folder.title === title);
  }

  renameFolder(folderId, newName) {
    this.#folders = this.#folders.map((folder) => (folder.id === folderId ? { ...folder, title: newName } : folder));

    const updatedFolder = this.getFolderById(folderId);
    this.#storage.setItem(updatedFolder);

    return updatedFolder;
  }
}

export default new FolderStore();
