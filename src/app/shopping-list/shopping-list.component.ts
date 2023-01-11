import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ShoppingListService } from './shopping-list.service';
import Ingredient from '../shared/ingredient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy{

  constructor(private fb: FormBuilder, private slService : ShoppingListService){}
  ingredients : Ingredient[] = []
  private getIngredientsSubscription! : Subscription;

  ngOnInit(): void {
    this.getAllIngredients();

    /** 
     * To get updates made to our ingredientsSubject subject (exposed as an observable through getIngredientListState) 
     * in shopping list service, we can imperatively subscribe to it here. We will need to manually unsubscribe later.
     */
    this.getIngredientsSubscription = this.slService.getIngredientListState().subscribe(ingredients => {
      this.ingredients = ingredients;
      console.log('New ingredient list tate emitted', ingredients)
    })
  }

  /* Call the shopping list service's getAllIngredients() No need to manually unsubscribe for http observables */
  getAllIngredients() {
    this.slService.getAllIngredients()
      .subscribe(ingredients => this.ingredients = ingredients)
  }

  /* Call the shopping list service's deleteIngredient(). No need to manually unsubscribe for http observables */
  onDeleteIngredient(id: string | null) {
    if(id) {
      this.slService.deleteIngredient(id)
      .subscribe(result => {
        console.log(result)
        this.ingredients = this.ingredients.filter(ing => ing.id != id)
      })
    } 
  }

  toggleStrikethrough(ing: Ingredient) {
    ing.checked = !ing.checked
    this.slService.updateIngredient(ing)
      .subscribe(result => console.log(result))
  }

  /* unsubscribe to our manually open subscription when component is destroyed */
  ngOnDestroy(): void {
    this.getIngredientsSubscription.unsubscribe()
  }
}
