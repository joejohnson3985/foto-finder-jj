// Variables
var photosArray = JSON.parse(localStorage.getItem('photosArray')) || [];

var addPhotoBtn = document.getElementById('add-photo-button');
var captionInput = document.getElementById('caption-input');
var fileInput = document.getElementById('file-upload');
var reader = new FileReader();
var photoCardTemplate = document.getElementById('photo-card-template');
var photoArea = document.getElementById('photo-area');
var searchInput = document.querySelector('#search-box');
var titleInput = document.getElementById('title-input');
var photoInputForm = document.getElementById('photo-input-form');

// Event Listeners
addPhotoBtn.addEventListener('click', function(e) {
  e.preventDefault();
  loadPhoto();
})

fileInput.addEventListener('change', function() {
  fileUploadSuccess();
  enableButtons();
});

photoArea.addEventListener('click', function(event) {
  deletePhoto();
  favoritePhoto();
});

photoArea.addEventListener('keyup', updateText);

photoInputForm.addEventListener('keyup', enableButtons);

searchInput.addEventListener('keydown', function() {
  searchPhotoCard();
});

window.addEventListener('keypress', function (e) {
 if (e.keyCode === 13) {
   updateText(e);
   e.target.blur();
 }
});

// Functions
function onload(oldPhotos) {
  photosArray = [];
  oldPhotos.forEach(function(photo) {
    var newPhotoCard = new Photo (photo.title, photo.caption, photo.id, photo.file);
    photosArray.push(newPhotoCard);
    addPhotoCard(newPhotoCard);
  });
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

function clearFields() {
  titleInput.value = '';
  captionInput.value = '';
};

function fileUploadSuccess() {
  if (fileInput.value !== '') {
    var inputButtonText = document.getElementById('input-button-text');
    inputButtonText.innerText = 'Success!';
  }
}

function deletePhoto() {
  if (event.target.id === 'delete') {
    event.target.closest('.photo-card').remove();
    var photoToDelete = findPhoto(event);
    photoToDelete.deleteFromStorage();
  }
}

function enableButtons() {
  if (captionInput.value !== '' && titleInput.value !== '' && fileInput.value !== '') {
    addPhotoBtn.disabled = false;
  }
}

function findPhoto(event) {
  var id = Number(event.target.closest('.photo-card').getAttribute('data-id'));
  return photosArray.find(function(photo) {
    return photo.id === id;
  });
}

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