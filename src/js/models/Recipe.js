import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() { 
    const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
    console.log(res);
    this.title = res.data.recipe.title;
    this.image_url = res.data.recipe.image_url;
    this.ingredients = res.data.recipe.ingredients;
    this.publisher = res.data.recipe.publisher;
    this.recipe_id = res.data.recipe.recipe_id;
    this.url = res.data.recipe.source_url;
  }

  calcTime() {
    const numIn = this.ingredients.length / 3;
    const time  = numIn * 15;
    this.time = time;
  }

  calcServing() {
    this.serving = 4;
  }

  parseIngredient() {
    const unitsLong = ['tablespoons', 'tablespoon', 'cups', 'cup', 'ounces', 'ounces', 'pounds', 'pound', 'teaspoons', 'teaspoon'];
    const unitsShort = ['tbsp', 'tbsp', 'cup', 'cup', 'oz', 'oz', 'pound', 'pound', 'tsp', 'tsp'];

    const newIngredients = this.ingredients.map(el => {
      // 1. Uniform unit
      let ingredient = el.toLowerCase();

      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });
    
      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3. Parse ingredient to unit, count and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // It's a unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }

      } else if (parseInt(arrIng[0])) {
        // It's not a unit, but 1st element is a number
        objIng = {
          count: parseInt(arrIng[0]),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        // It's not a unit
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }
}