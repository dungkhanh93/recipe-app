import { elements } from './DOM';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResult = () => {
  elements.searchResList.innerHTML = '';
};

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
      <a class="results__link" href="${recipe.recipe_id}">
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

export const renderResult = (recipes, page = 1, resPerPage = 5) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(recipeResult);
};
