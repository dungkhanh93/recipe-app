import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() { 
    const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
    this.title = res.data.recipe.title;
    this.image_url = res.data.recipe.image_url;
    this.ingredients = res.data.recipe.ingredients;
    this.publisher = res.data.recipe.publisher;
    this.recipe_id = res.data.recipe.recipe_id;
  }

  calcTime() {
    const numIn = this.ingredients.length / 3;
    const time  = numIn * 15;
    this.time = time;
  }

  calcServing() {
    this.serving = 4;
  }
}