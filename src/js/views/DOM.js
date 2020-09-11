export const elements = {
  searchInput: document.querySelector('.search__field'),
  searchForm: document.querySelector('.search'),
  searchResList: document.querySelector('.results__list'),
  searchResult: document.querySelector('.results'),
  searchResPage: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  likeList: document.querySelector('.likes__list')
};

export const elementString = {
  loader: 'loader',
};

export const renderLoader = (parent) => {
  const loader = `
    <div class="${elementString.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementString.loader}`);
  if (loader) loader.parentNode.removeChild(loader);
};

export const scrollToTop = () => {
  const docPos = document.documentElement.scrollTop || document.body.scrollTop;
  if (docPos > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, docPos - docPos / 8);
  }
};