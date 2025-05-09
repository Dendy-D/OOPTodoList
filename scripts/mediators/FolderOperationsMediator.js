export class FolderOperationsMediator {
  constructor(folderCtrl, taskCtrl) {
    this.folderCtrl = folderCtrl;
    this.taskCtrl = taskCtrl;
  }

  rename(folderId, newName, dublicatingNameValidationFlag) {
    const folder = this.folderCtrl.renameFolder(folderId, newName, dublicatingNameValidationFlag);
    if (folder) {
      this.taskCtrl.onFolderRenamed(folder);
    }
    return folder;
  }

  getFolder(folderId) {
    return this.folderCtrl.store.getFolderById(folderId);
  }

  getAllFolders() {
    return this.folderCtrl.store.folders;
  }
}
