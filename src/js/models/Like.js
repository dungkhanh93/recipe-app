export default class Like {
  constructor() { 
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const item = { id, title, author, img };
    this.likes.push(item);
    this.setDataToStorage();
    return item;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id); 
    this.likes.splice(index, 1);
    this.setDataToStorage();
  }

  isLike(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumberLike() {
    return this.likes.length;
  }

  setDataToStorage() {
    localStorage.setItem('likes', JSON.stringify(this.likes))
  }

  getDataFormStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));
    if(storage) this.likes = storage;
  }

 }