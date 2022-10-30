import './sass/index.scss';

import NewsApiService from './js/api-service';
import renderCard from './js/renderCard';
import { lightbox } from './js/onslidermake';
//import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('.search-form'),
  galleryContainer = document.querySelector('.gallery'),
  loadMoreBtn = document.querySelector('.load-more'),
  searchBtn = document.querySelector('.search');

let isShown;
const newsApiService = new NewsApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

//////---- FUNCTION ----////
function onSearch(e) {
  e.preventDefault();

  galleryContainer.innerHTML = '';
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  newsApiService.resetPage();

  if (newsApiService.query === '') {
    Notify.warning('Please, fill the main field');
    return;
  }

  isShown = 1;
  fetchGallery();
  onRenderGallery(hits);
}

function onLoadMore() {
  newsApiService.page;
  fetchGallery();
}
// searchBtn.addEventListener('click', () => {
//   Notify.success(`Hooray! We found 500 images !!!`);
// });
async function fetchGallery() {
  loadMoreBtn.classList.add('is-hidden');

  const r = await newsApiService.fetchGallery();
  const { hits, totalHits } = r;
  isShown += hits.length;

  if (!hits.length) {
    Notify.warning(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    loadMoreBtn.classList.add('is-hidden');
    return;
  }

  onRenderGallery(hits);
  isShown += hits.length;
  console.log(isShown);
  console.log(hits);

  if (isShown === 81 && totalHits !== 0) {
    Notify.success(`Hooray! We found ${totalHits} images !!!`);
    loadMoreBtn.classList.remove('is-hidden');
  }

  if (isShown < totalHits) {
    //   // Показывает кнопку
    //   // Notify.success(`Hooray! We found ${totalHits} images !!!`);
    loadMoreBtn.classList.remove('is-hidden');
  }

  // Если пользователь дошел до конца коллекции, пряч кнопку и выводи уведомление с текстом:
  if (isShown >= totalHits) {
    Notify.info('We re sorry, but you have reached the end of search results.');
  }
}

function onRenderGallery(elements) {
  const markup = elements
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
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
      }
    )
    .join('');
  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
