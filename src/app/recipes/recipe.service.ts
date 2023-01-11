import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'

import Recipe from './recipe.model';
import { SnackbarService } from '../snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  
  /* Set up for the Firebase url strings found in environment.ts and http headers when needed */
  apiUrl : string = environment.apiUrl + 'recipes';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http : HttpClient, private snackbar : SnackbarService) {
  }

  /** 
   * As opposed to the shopping list service, we don't need to listen to changes of our recipes list.
   * This is to demonstrate simple usage of CRUD http observables where we don't need to track the state of an array. 
   */
  getAllRecipes() : Observable<Recipe[]> {
    const url = this.apiUrl + '.json'
    return this.http.get<Recipe[]>(url).pipe(
      map(data => {
        /**
        * Firebase data returns a JSON tree and we need to turn it into an array of objects 
        * {...body, id: id} uses spread syntax to copy all ingredient params but add an id param.  
        */
        return Object.entries(data).map(([id, body]) => ({...body, id:id}))
      }),
      tap(result => console.log('All Recipes retrieved', result)),
      catchError(this.handleError<Recipe[]>('Get Recipes', []))
    )
  }

  getRecipeById(id: string) : Observable<Recipe> {
    const url = this.apiUrl + `/${id}` + '.json'
    return this.http.get<Recipe>(url).pipe(
      catchError(this.handleError<Recipe>(`Get Recipe ID=${id}`))
    )
  }

  updateRecipe(recipe: Recipe) : Observable<Recipe> {
    const url = this.apiUrl + `/${recipe.id}` + '.json'
    return this.http.put<Recipe>(url, recipe, this.httpOptions).pipe(
      tap(res => console.log(`Updated Recipe with name ${res.name}`)),
      /* Use rxjs tap (updated from do()) for side effects. Here we call our custom snackbar service to show it to the user. */
      tap(_ => this.snackbar.show('Successfully updated Recipe')),
      catchError(this.handleError<Recipe>(`Update recipe with id=${recipe.id}`))
    )
  }

  addRecipe(recipe: Recipe) : Observable<{name: string}> {
    const url = this.apiUrl + '.json'
    return this.http.post<Recipe>(url, recipe, this.httpOptions).pipe(
      tap(res => console.log(`Added Recipe with name ${res.name}`)),
      tap(_ => this.snackbar.show('Successfully added Recipe')),
      catchError(this.handleError<Recipe>(`Add recipe with name ${recipe.name}`))
    )
  }

  deleteRecipe(id: string) : Observable<Recipe> {
    const url = this.apiUrl + `/${id}` + '.json'
    return this.http.delete<Recipe>(url).pipe(
      tap(_ => console.log(`Deleted Recipe with id=${id}`)),
      tap(_ => this.snackbar.show('Successfully deleted Recipe')),
      catchError(this.handleError<Recipe>(`Add recipe with id=${id}`))
    )
  }

  /* Placeholder error handler in case you need to log errors. For now, we just display the error in the console. */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any) : Observable<T> => {
      console.error(operation, error);
      return of(result as T);
    }
  }
}
