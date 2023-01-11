import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EMPTY, map, Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import Ingredient from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';


@Component({
  selector: 'app-shopping-add',
  templateUrl: './shopping-add.component.html',
  styleUrls: ['./shopping-add.component.css']
})
export class ShoppingAddComponent {

  constructor(private fb : FormBuilder, private slService: ShoppingListService){}
  
  isLoading = false;

  /* Straightforward form builder for our reactive form */
  ingredientForm = this.fb.group({
    name: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')]]
  })

  /* Getters for our reactive form controls for easier access by our template or here 
  *  We can also use typesafe reactive forms through this.ingredientForm.values.email
  */
  get name(){return this.ingredientForm.get('name')}
  get quantity(){return this.ingredientForm.get('quantity')}

  onSubmit(){
    if(this.name?.value && this.quantity?.value && !isNaN(Number(this.quantity?.value))) {
      this.isLoading = true;
      const newIng = new Ingredient(null, this.name?.value, +this.quantity?.value, 0, false)
      this.slService.addIngredient(newIng).subscribe(_ => {
        this.isLoading = false;
        this.onClearForm()
      })
    }
    
  }

  toggleLoading(){
    this.isLoading =  !this.isLoading
  }

  onClearForm(){
    this.ingredientForm.reset()
  }

}
