// Global app controller
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/DOM';
import * as searchView from './views/searchView';

/**
 * Global State
 * - Search object
 * - Current Recipe Object
 * - Shopping list
 * - Wishlist
 */
const state = {};

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
