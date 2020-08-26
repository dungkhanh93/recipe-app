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
      console.log(arrIng);
      console.log(unitIndex);

      let objIng;

      if (unitIndex > -1) {
        // This is a unit
        let count;
        if(unitIndex > 1) {

        } else {
          
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

}