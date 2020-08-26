// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader, scrollToTop } from './views/DOM';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/**
 * Global State
 * - Search object
 * - Current Recipe Object
 * - Shopping list
 * - Wishlist
 */
const state = {};


/**
 * SEARCH CONTROLLER
 */
const controllerSearch = async () => {
  // 1. Get query value from ur
  const query = searchView.getInput();

  if (query) {
    // 2. Get data from api and add to state
    state.search = new Search(query);

    // 3. Prepare UI for search
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchResult);

    // 4. Get results
    await state.search.getResult();

    // 5. Render result to ui
    clearLoader();
    searchView.renderResult(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controllerSearch();
});

elements.searchResPage.addEventListener('click', e => {
  // console.log(e.target);
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.page);
    searchView.clearResult();
    searchView.clearResPage();
    searchView.renderResult(state.search.result, goToPage);
  }
})


/**
 * RECIPE CONTROLLER
 */

const controllerRecipe = async () => {
  // 1. Get id from URL
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // 2. Prepare ui
    scrollToTop();
    
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // 3. Create new object recipe
    state.recipe = new Recipe(id);

    // 4. Get recipe
    await state.recipe.getRecipe();
    state.recipe.parseIngredient();
    state.recipe.calcTime(); 
    state.recipe.calcServing();

    // 5. Render to view
    clearLoader();
    recipeView.renderRecipe(state.recipe);
    console.log(state.recipe);
  }
}

// window.addEventListener('hashchange', controllerRecipe);

['load', 'hashchange'].forEach(el => window.addEventListener(el, controllerRecipe))
