export class LocalStorageService {
  constructor(type) {
    this.type = type;
  }

  getItem(id) {
    return JSON.parse(localStorage.getItem(`${this.type}-${id}`));
  }

  setItem(entity) {
    localStorage.setItem(`${this.type}-${entity.id}`, JSON.stringify(entity));
  }

  removeItem(id) {
    localStorage.removeItem(`${this.type}-${id}`);
  }

  clear() {
    localStorage.clear();
  }

  getAllItems() {
    return (
      Object.entries(localStorage)
        .filter(([key]) => key.startsWith(`${this.type}-`))
        .map(([_, value]) => JSON.parse(value))
        .sort((a, b) => a.createdAt - b.createdAt) || []
    );
  }
}
