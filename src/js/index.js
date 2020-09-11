// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import { elements, renderLoader, clearLoader, scrollToTop } from './views/DOM';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';

/**
 * Global State
 * - Search object
 * - Current Recipe Object
 * - Shopping list
 * - Wishlist
 */
const state = {};

window.recipeState = state;

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
    searchView.clearResPage();
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
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    scrollToTop();

    if(state.search) searchView.linkActive(id);

    // 3. Create new object recipe
    state.recipe = new Recipe(id);

    // 4. Get recipe
    await state.recipe.getRecipe();
    state.recipe.calcTime(); 
    state.recipe.calcServing();
    state.recipe.parseIngredients();

    // 5. Render to view
    clearLoader();
    recipeView.renderRecipe(state.recipe, state.like.isLike(id));
    console.log(state.recipe);
  }
}

// window.addEventListener('hashchange', controllerRecipe);
// window.addEventListener('load', controllerRecipe);

['load', 'hashchange'].forEach(el => window.addEventListener(el, controllerRecipe));


/**
 * LIST CONTROLLER
 */

const listController = () => {
  if(!state.list) state.list = new List();
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  })
}

// Handle delete and update count list 
elements.shopping.addEventListener('click', e => {  
  const id = e.target.closest('.shopping__item').dataset.id;
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Remove item list from data
    state.list.deleteItem(id);

    // Remove item from ui
    listView.deleteItem(id);
  }
})

/**
 * LIKE CONTROLLER
 */

const likeController = () => {
  // Create new likes
  const curId = state.recipe.id;
  if(!state.like) state.like = new Like();

  // Add new like to state data
  if(!state.like.isLike(curId)) {
    // Add item to data
    const item = state.like.addLike(curId, state.recipe.title, state.recipe.publisher, state.recipe.image_url); 

    // Toggle button
    likeView.toggleButton(state.like.isLike(curId));
    likeView.toggleLikeMenu(state.like.getNumberLike());

    // Render item to UI
    likeView.renderItem(item);
  } else {
    // Remove item from data
    state.like.deleteLike(curId);

    // Toggle button
    likeView.toggleButton(state.like.isLike(curId));
    likeView.toggleLikeMenu(state.like.getNumberLike());

    // Remove item from UI
    likeView.deleteItem(curId);
    console.log(state.like);
  }
}


// Handle page load event
window.addEventListener('load', () => {
  if(!state.like) state.like = new Like();
  likeView.toggleLikeMenu(state.like.getNumberLike());
})

// Handle click button recipes
elements.recipe.addEventListener('click', (e) => {
  if(e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Update serving
    if (state.recipe.serving > 1) {
      state.recipe.updateServing('dec');
      recipeView.updateServingIngredient(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServing('inc');
    recipeView.updateServingIngredient(state.recipe);
  } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    listController();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    likeController();
  }
})