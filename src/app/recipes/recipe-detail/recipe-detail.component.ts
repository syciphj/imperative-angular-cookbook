import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Recipe from '../recipe.model';
import { RecipeService } from '../recipe.service';
import Ingredient from 'src/app/shared/ingredient.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy{
  constructor(
    private recipeService: RecipeService,
    private slService: ShoppingListService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ){}

  recipe? : Recipe
  id? : string | null
  isAlertVisible : boolean = false;

  isLoggedInSubscription! : Subscription;
  isLoggedIn : boolean = false;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getRecipe(this.id)
    this.isLoggedInSubscription = this.authService.user$.subscribe(user => this.isLoggedIn = !!user)
  }

  getRecipe(id: string | null) {
    if(id) {
      this.recipeService.getRecipeById(id)
      .subscribe(recipe => this.recipe = recipe)
    }
  }

  goBackToRecipes() {
    this.router.navigate(['recipes'])
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route, state: {recipe: this.recipe}})
  }

  onDeleteCheck() {
    if(!this.isLoggedIn){
      this.router.navigate(['login'])
    } else {
      this.isAlertVisible = true;
    }
  }

  onDeleteRecipe() {
    if(this.recipe && this.id) {
      this.recipeService.deleteRecipe(this.id).subscribe(_ => {
        this.router.navigate(['recipes'])
      })
    }
  }

  onMoveToShoppinglist() {
    if(this.recipe?.ingredients && this.recipe?.ingredients.length > 0) {
      this.slService.addIngredients(this.recipe.ingredients).subscribe(results => console.log(results))
    }
  }

  toggleStrikethrough(ing : Ingredient) {
    ing.checked = !ing.checked
  }

  closeAlert() {
    this.isAlertVisible = false;
  }

  ngOnDestroy(): void {
    this.isLoggedInSubscription.unsubscribe()
  }


}
