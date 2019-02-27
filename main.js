var photosArray = JSON.parse(localStorage.getItem('photosArray')) || [];

var reader = new FileReader();
var fileInput = document.getElementById('file-upload');
var photoCardTemplate = document.getElementById('photo-card-template');
var photoArea = document.getElementById('photo-area');
var addPhotoBtn = document.getElementById('add-photo-button');
var titleInput = document.getElementById('title-input');
var captionInput = document.getElementById('caption-input');
var searchInput = document.querySelector('#search-box');

addPhotoBtn.addEventListener('click', function(e) {
  e.preventDefault();
  loadPhoto();
})

photoArea.addEventListener('click', function(event) {
  deletePhoto();
  favoritePhoto();
});

searchInput.addEventListener('keydown', function() {
  searchPhotoCard();
});

photoArea.addEventListener('keyup', updateText);

window.addEventListener('keypress', function (e) {
 if (e.keyCode === 13) {
   updateText(e);
   e.target.blur();
 }
});

function onload(oldPhotos) {
  photosArray = [];
  oldPhotos.forEach(function(photo) {
    var newPhotoCard = new Photo (photo.title, photo.caption, photo.id, photo.file);
    photosArray.push(newPhotoCard);
    addPhotoCard(newPhotoCard);
  });
};

function clearFields() {
  titleInput.value = '';
  captionInput.value = '';
};

function loadPhoto() {
  if (fileInput.files[0]) {
    reader.readAsDataURL(fileInput.files[0]); 
    reader.onload = photoClass;
  }
}

function photoClass(e) {
  var newPhoto = new Photo(titleInput.value, captionInput.value, Date.now(), e.target.result);
  addPhotoCard(newPhoto);
  photosArray.push(newPhoto);
  newPhoto.saveToStorage(photosArray);
};

function addPhotoCard(newPhotoCard) {
  var clone = photoCardTemplate.content.cloneNode(true);
  clone.getElementById('photo-card').setAttribute('data-id', newPhotoCard.id);
  clone.getElementById('photo-title').innerText = newPhotoCard.title;
  clone.getElementById('photo-caption').innerText = newPhotoCard.caption;
  clone.getElementById('photo-file').src = newPhotoCard.file;
  photoArea.insertBefore(clone, photoArea.firstChild);
  clearFields();
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

function searchPhotoCard() {
    photoArea.innerHTML = '';
    var filteredPhotos = photosArray.filter(function(photo) {
      return photo.caption.toLowerCase().includes(searchInput.value) || photo.title.toLowerCase().includes(searchInput.value);
    });
    filteredPhotos.forEach(function(photo) {
      addPhotoCard(photo);
    })
};

function updateText(e) {
  var photoToUpdate = findPhoto(event);
  console.log(photoToUpdate);
  if (e.target.id === 'photo-title') {
    photoToUpdate.title = e.target.innerText;
  }
  if (e.target.id === 'photo-caption') {
    photoToUpdate.caption = e.target.innerText;
  }
  photoToUpdate.saveToStorage();
}

onload(photosArray);