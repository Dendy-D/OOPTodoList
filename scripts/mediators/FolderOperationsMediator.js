export class FolderOperationsMediator {
  constructor(folderCtrl, taskCtrl) {
    this.folderCtrl = folderCtrl;
    this.taskCtrl = taskCtrl;
  }

  rename(folderId, newName) {
    const folder = this.folderCtrl.renameFolder(folderId, newName);
    this.taskCtrl.onFolderRenamed(folder);
  }

  getFolder(folderId) {
    return this.folderCtrl.store.getFolderById(folderId);
  }

  getAllFolders() {
    return this.folderCtrl.store.folders;
  }
}
