export default class Like {
  constructor() { 
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const item = { id, title, author, img}
    this.likes.push(item);
    return item;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);
  }

  isLike(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumberLike() { 
    return this.likes.length;
  }

}