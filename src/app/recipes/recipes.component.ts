import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import Recipe from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  constructor(private recipeService : RecipeService) {}

  recipes : Recipe[] = []
  ngOnInit() {
    // this.recipeService.getAllRecipes()
    //   .subscribe(recipes => this.recipes = recipes)
  }

}
