import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import Recipe from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit{
  constructor(
    public route: ActivatedRoute, 
    private router: Router,
    private recipeService: RecipeService,
    private location: Location) {}


  recipe? : Recipe
  id? : string | null;
  editMode : boolean = false;
  recipeForm! : FormGroup
  isAlertVisible : boolean = false;
  submitBtnTxt: string = ''
  previousPage: string = ''
  isLoading = false;

  /* Getters for our reactive form controls and form array */
  get name() {return this.recipeForm.get('name')}
  get url() {return this.recipeForm.get('url')}
  get description() {return this.recipeForm.get('description')}
  get ingredients(){
    return <FormArray>this.recipeForm?.get('ingredients')
  }


  ngOnInit(): void {
    this.initRecipe();
  }


  /** 
   * This part is a little verbose, but in essence it will check if we are in edit mode or new recipe mode.
   * We use the recipe detail either from navigation extras or an http get call to fill the form. 
   */
  initRecipe() {
    this.editMode = this.route.snapshot.paramMap.get('id') !== null
    this.submitBtnTxt = this.editMode ? 'Save Changes' : 'Add Recipe'
    this.previousPage = this.editMode ? 'Recipe Details' : 'Recipes'

    /** 
     * When edting, we initially use navigation extras to get the recipe object from browser history to avoid a db call
     * if not available (e.g. went to edit through url), request from db
     */
    if(this.editMode) {
      this.id = this.route.snapshot.paramMap.get('id')
      if(history.state.recipe) {
        this.recipe = history.state.recipe
        this.initFilledForm()
      } else {
        if(this.id !== null) this.recipeService.getRecipeById(this.id)
        .subscribe((recipe) => {
          this.recipe = recipe
          this.initFilledForm()
        })
      }
    } else {
      this.initEmptyForm()
    }
  }

  initEmptyForm() {
    let ingForms = new FormArray<FormGroup>([]);
    ingForms.push(
      new FormGroup({
        'name': new FormControl('', Validators.required),
        'quantity': new FormControl('', [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
      })
    )

    this.recipeForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'url': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'ingredients': ingForms
    })

    this.recipe = new Recipe(null, '','','',[])
  }

  initFilledForm() {
    let ingForms = new FormArray<FormGroup>([]);
    if(this.recipe && this.recipe.ingredients.length > 0) {
      this.fillIngredientFormArray(this.recipe, ingForms)

      this.recipeForm = new FormGroup({
        'name': new FormControl(this.recipe.name, Validators.required),
        'url': new FormControl(this.recipe.imageUrl, Validators.required),
        'description': new FormControl(this.recipe.description, Validators.required),
        'ingredients': ingForms
      })
    }
  }

  fillIngredientFormArray(recipe: Recipe, ingForms : FormArray) {
    recipe.ingredients.forEach((ing) => {
      ingForms.push(
        new FormGroup({
          'name': new FormControl(ing.name, Validators.required),
          'quantity': new FormControl(ing.quantity, [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
        })
      )
    })
  }

  onSubmit() {
    if(this.recipe){
      this.recipe.description = this.description?.value;
      this.recipe.name = this.name?.value;
      this.recipe.imageUrl = this.url?.value;
      this.recipe.ingredients = this.recipeForm.value['ingredients']
      this.isLoading = true;

      if(this.editMode) {
        this.onEditRecipe(this.recipe)
      } else {
        this.onAddRecipe(this.recipe)
      }
    }
  }

  onAddIngredient() {
    this.ingredients.push(
      new FormGroup({
        'name': new FormControl('', Validators.required),
        'quantity': new FormControl('', [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
      })
    )
  }

  onEditRecipe(recipe: Recipe) {
    recipe.id = this.id
   this.recipeService.updateRecipe(recipe).subscribe(_ => {
    this.recipeForm.markAsPristine()
    this.isLoading = false;
   })
  }

  onAddRecipe(recipe: Recipe) {
    this.recipeService.addRecipe(recipe).subscribe(result => {
      if(result && result.name) {
        this.router.navigate(['recipes', result.name])
        this.isLoading = false;
      }
    })
  }

  onResetForm() {
    if(this.editMode && this.recipe) {
      this.ingredients.clear()
      this.recipe.ingredients.forEach(_ => this.onAddIngredient())
      this.recipeForm.setValue({
        name: this.recipe.name,
        description: this.recipe.description,
        url: this.recipe.imageUrl,
        ingredients: this.recipe.ingredients
      })
      this.recipeForm.markAsPristine()
    }
  }

  closeAlert() {
    this.isAlertVisible = false;
  }

  onDeleteIngredient(i : number) {
    this.ingredients.removeAt(i);
    this.recipeForm.get('ingredients')?.markAsDirty()
    console.log(this.recipeForm)
  }

  onDeleteCheck() {
    this.isAlertVisible = true;
  }

  onDeleteRecipe() {
    this.isAlertVisible = false;
    if(this.recipe && this.id) {
      this.recipeService.deleteRecipe(this.id).subscribe(result => {
        this.router.navigate(['recipes'])
      })
    }
  }

  goBack() {
    this.editMode ? this.router.navigate(['recipes', this.id]) : this.router.navigate(['recipes'])
  }

}
