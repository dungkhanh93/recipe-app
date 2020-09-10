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

  parseIngredients() { 
    // tablespoons => tbsp, cups => cup, ounce => oz
    const unitsLong = ['teaspoons', 'teaspoon', 'cups', 'cup', 'ounces', 'ounce', 'tablespoons', 'tablespoon', 'pound']
    const unitsShot = ['tsp', 'tsp', 'cup', 'cup', 'oz', 'oz', 'tbsp', 'tbsp', 'pound']

    const newIngredients = this.ingredients.map(el => {
      // 1. Uniform units
      let ingredient = el.toLowerCase();

      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShot[index]);
      }) 

      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3. Parse ingredients to count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => unitsShot.includes(el2));
      
      let objIng;

      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if(arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'))
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.splice(unitIndex + 1).join(' ')
        }

      } else if(parseInt(arrIng[0])) {
        // Not a unit, but is a number
        objIng = {
          count: parseInt(arrIng[0]),
          unit: '',
          ingredient: arrIng.splice(1).join(' ')
        }
      } else if (unitIndex === -1){
        // This is No a unit
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }
      }

      return objIng;
    })

    this.ingredients = newIngredients;
  }

  updateServing(type) {
    // Update serving
    const newServing = type === 'dec' ? this.serving - 1 : this.serving + 1;

    // Update ingredient
    this.ingredients.forEach(el => {
      el.count = el.count * (newServing / this.serving); // 1, serving: 5 => 1 * (5/4) = 1.25
    })

    this.serving = newServing;
  }
}