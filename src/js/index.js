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

    if(state.search) searchView.linkActive(id);

    // 3. Create new object recipe
    state.recipe = new Recipe(id);

    // 4. Get recipe
    await state.recipe.getRecipe();
    state.recipe.parseIngredient();
    state.recipe.calcTime(); 
    state.recipe.calcServing();

    // 5. Render to view
    clearLoader();
    recipeView.renderRecipe(state.recipe, state.like.isLike(id));
    console.log(state.recipe);
  }
}

['load', 'hashchange'].forEach(el => window.addEventListener(el, controllerRecipe))

/**
 * LIST CONTROLLER
 */

const controllerList = () => {
  // Create new item
  if (!state.list) state.list = new List();

  // Add item for each ingredient
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  })
}

// Handle delete and update count list item
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete item from State
    state.list.deleteItem(id);

    // Delete item from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseInt(e.target.value);
    state.list.updateCount(id, val);
  }
});


/**
 * LIST CONTROLLER
 */

const controllerLike = () => {
  // Create new Like and add to State
  if (!state.like) state.like = new Like();
  const curID = state.recipe.id;

  // Not yet like
  if (!state.like.isLike(curID)) {
    // Add like to State
    const item = state.like.addLike(curID, state.recipe.title, state.recipe.publisher, state.recipe.image_url);

    // Toggle button like
    likeView.toggleButton(state.like.isLike(curID));

    // Add item to ui
    likeView.renderItem(item);

    // Has liked
  } else {
    // remove like from State
    state.like.deleteLike(curID);

    // Toggle button like
    likeView.toggleButton(state.like.isLike(curID));

    // remove item from ui
    likeView.deleteItem(curID);
  }
  likeView.toggleLikeMenu(state.like.getNumberLike());
}

// Restore when load page
window.addEventListener('load', () => {
  state.like = new Like();
  state.like.getDataFormStorage();
  likeView.toggleLikeMenu(state.like.getNumberLike());
  state.like.likes.forEach(like => likeView.renderItem(like));
})

// Handle recipe buttons click events
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.serving > 1) {
      state.recipe.updateServing('dec')
      recipeView.updateServingIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServing('inc')
    recipeView.updateServingIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    // Controller list
    controllerList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controllerLike();
  }
});