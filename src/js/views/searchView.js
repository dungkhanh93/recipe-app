import { elements } from './DOM';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResult = () => {
  elements.searchResList.innerHTML = '';
};

export const clearResPage = () => {
  elements.searchResPage.innerHTML = '';
}

/*
Balsamic Strawberry and Chicken Pizza with Sweet Onions and Smoked Bacon
acc = 0 / acc + cur.length = 8 
acc = 8 / acc + cur.length = 8 + 10 = 18
*/

const limitRecipeTitle = (title, limit = 15) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
};

const recipeResult = (recipe) => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
  `;

  elements.searchResList.insertAdjacentHTML('afterbegin', markup);
};

// Type 'next' or 'prev'
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-page=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;

  if(page === 1 && pages > 1) {
    // Only render next button
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Render both button
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    // Only render prev button
    button = createButton(page, 'prev');
  }

  elements.searchResPage.insertAdjacentHTML('afterbegin', button);
}

export const renderResult = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(recipeResult);

  renderButtons(page, recipes.length, resPerPage);
};
