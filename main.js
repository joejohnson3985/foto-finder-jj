

// var create = document.querySelector('button');
// var photoGallery = document.querySelector('.images');
// var imagesArr = JSON.parse(localStorage.getItem('photos')) || [];

// window.addEventListener('load', addPhotoCard);
// create.addEventListener('click', loadImg);

// function appendPhotos() {
//   imagesArr.forEach(function (photo) {
//     photoGallery.innerHTML += `<img src=${photo.file} />`
//   })
// }

// function addPhoto(e) {
//   // console.log(e.target.result);
//   var newPhoto = new Photo(Date.now(), e.target.result);
//   photoGallery.innerHTML += `<img src=${e.target.result} />`;
//   imagesArr.push(newPhoto)
//   newPhoto.saveToStorage(imagesArr)
// }

var photosArray = JSON.parse(localStorage.getItem('photosArray')) || [];

var reader = new FileReader();
var fileInput = document.getElementById('file-upload');
var photoCardTemplate = document.getElementById('photo-card-template');
var photoArea = document.getElementById('photo-area');
var addPhotoBtn = document.getElementById('add-photo-button');
var titleInput = document.getElementById('title-input');
var captionInput = document.getElementById('caption-input');

addPhotoBtn.addEventListener('click', function(e) {
  e.preventDefault();
  loadPhoto();
})

photoArea.addEventListener('click', function(event) {
  deletePhoto();
  favoritePhoto();
});

onload(photosArray);

function onload(oldPhotos) {
  photosArray = [];
  oldPhotos.forEach(function(photo) {
    var newPhotoCard = new Photo (photo.title, photo.caption, photo.id, photo.file);
    photosArray.push(newPhotoCard);
    addPhotoCard(newPhotoCard);
  });
};

function clearFields() {
  titleInput.value = "";
  captionInput.value = "";
};

function loadPhoto() {
  console.log(fileInput.files[0])
  if (fileInput.files[0]) {
    reader.readAsDataURL(fileInput.files[0]); 
    reader.onload = photoClass;
  }
}

function photoClass(e) {
  var newPhoto = new Photo(titleInput.value, captionInput.value, Date.now(), e.target.result);
  console.log(newPhoto);
  addPhotoCard(newPhoto);
  console.log(photosArray);
  photosArray.push(newPhoto);
  newPhoto.saveToStorage(photosArray);
};

function addPhotoCard(newPhotoCard) {
  var clone = photoCardTemplate.content.cloneNode(true);
  clone.getElementById("photo-card").setAttribute('data-id', newPhotoCard.id);
  clone.getElementById("photo-title").innerText = newPhotoCard.title;
  clone.getElementById("photo-caption").innerText = newPhotoCard.caption;
  console.log(newPhotoCard.file);
  clone.getElementById("photo-file").src = newPhotoCard.file;
  photoArea.insertBefore(clone, photoArea.firstChild);
};

function deletePhoto() {
  if (event.target.id === 'delete') {
    event.target.closest('.photo-card').remove();
    var photoToDelete = findPhoto(event);
    photoToDelete.deleteFromStorage();
  }
}

function findPhoto(event) {
  var id = Number(event.target.closest('.photo-card').getAttribute('data-id'));
  return photosArray.find(function(photo) {
    return photo.id === id;
  });
}

function favoritePhoto(e) {
  photo.favorite = !favorite;
}