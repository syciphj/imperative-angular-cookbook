import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Recipe from '../recipe.model';
import { RecipeService } from '../recipe.service'


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit{

  constructor( 
      private recipeService: RecipeService, 
      private router: Router,
      private route: ActivatedRoute
    ){}

  recipes: Recipe[] = []

  /* Straightforward subscription to an http get that only emits once and closes. */
  ngOnInit(): void {
    this.recipeService.getAllRecipes()
      .subscribe((recipes)=> this.recipes = recipes)
  }

  onAddRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

}
