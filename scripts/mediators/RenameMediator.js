export class RenameMediator {
  constructor(folderCtrl, taskCtrl) {
    this.folderCtrl = folderCtrl;
    this.taskCtrl = taskCtrl;
  }

  execute(folderId, newName) {
    const folder = this.folderCtrl.renameFolder(folderId, newName);
    this.taskCtrl.onFolderRenamed(folder);
  }
}
