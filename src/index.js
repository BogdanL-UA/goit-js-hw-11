import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './ApiServise';

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 300,
  docClose: true,
});

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const { form, gallery, loadMoreBtn } = refs;

const ApiServise = new API();

function onSubmit(e) {
  e.preventDefault();
  loadMoreBtn.classList.add('is-hidden');
  ApiServise.resetPageCount();

  ApiServise.searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (ApiServise.searchQuery === '') {
    Notiflix.Notify.warning('Please, write something!', {
      timeout: 6000,
    });
  } else {
    clearGallery();
    ApiServise.fetchPhotos().then(renderPhotos).catch(onCatch);
  }
}

function onLoadMoreBtnClick() {
  ApiServise.fetchPhotos().then(renderPhotos).catch(onCatch);
}

function renderPhotos(photos) {
  showPhotoTotalHits(photos.totalHits, photos.hits.length);
  if (photos.hits.length === 0) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        timeout: 6000,
      }
    );
  } else {
    loadMoreBtn.classList.remove('is-hidden');
    const markup = photos.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes:${likes}</b>
          </p>
          <p class="info-item">
            <b>Views:${views}</b>
          </p>
          <p class="info-item">
            <b>Comments:${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads:${downloads}</b>
          </p>
        </div>
      </div>`;
        }
      )
      .join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    chekEndOfList(photos.totalHits);
    lightbox.refresh();
  }
}

function chekEndOfList(totalHits) {
  if (totalHits / ApiServise.per_page <= ApiServise.page) {
    loadMoreBtn.classList.add('is-hidden');
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results.",
      {
        timeout: 6000,
      }
    );
  }
}

function showPhotoTotalHits(totalHits, length) {
  console.log(length);
  if (length === 0) {
    return;
  } else if (ApiServise.page === 2) {
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`, {
      timeout: 6000,
    });
  }
}

function onCatch(error) {
  if (error) {
    Notiflix.Notify.failure(`Error: ${error.message}!`, {
      timeout: 6000,
    });
  }
}

function clearGallery() {
  gallery.innerHTML = '';
}

loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
form.addEventListener('submit', onSubmit);
