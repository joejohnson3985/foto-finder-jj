class Photo {
  constructor(title, caption, id, file) {
    this.title = title;
    this.caption = caption;
    this.id = id;
    this.file = file;
    this.favorite = false;
  }
  deleteFromStorage() {
    var index = photosArray.indexOf(this);
    photosArray.splice(index, 1);
    this.saveToStorage();
  }
  saveToStorage() {
    localStorage.setItem('photosArray', JSON.stringify(photosArray));
  }
  updatePhoto() {
    var index = photosArray.indexOf(this);
    this.saveToStorage();
  }
};