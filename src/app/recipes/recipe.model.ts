import Ingredient from "../shared/ingredient.model"

export default class Recipe {
  constructor(
    public id: string | undefined | null,
    public name: string,
    public description: string,
    public imageUrl: string,
    public ingredients: Ingredient[]
  ){}
}