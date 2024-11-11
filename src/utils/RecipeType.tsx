type RecipeType = {
  _id: string;
  userId: string;
  recipeName: string;
  recipeIngredients: string[];
  imageEncoding: string;
  favorite?: boolean | null;
};

export default RecipeType;
