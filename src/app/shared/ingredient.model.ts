export default class Ingredient {
  constructor(
    public id: string | null,
    public name: string,
    public quantity: number,
    public price: number,
    public checked: boolean
  ){}
}