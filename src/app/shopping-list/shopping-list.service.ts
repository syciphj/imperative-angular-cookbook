import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, Subject, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import Ingredient from '../shared/ingredient.model';
import { SnackbarService } from '../snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor( private http : HttpClient, private snackbar: SnackbarService) { }

  /* Set up for the Firebase url strings found in environment.ts and http headers when needed */
  apiUrl : string = environment.apiUrl + 'ingredients';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

 /** 
  * Set up a subject we can update when there are changes to our ingredient list 
  * We set this as private to this service to prevent outside changes to the subject. 
  * This is a different, but common strategy when we want to update components without another getAll() type of http call.
  */
  private ingredientsSubject = new Subject<Ingredient[]>();
  /* Optionally have our own ingredients array for easy tracking when we manipulate the array to update ingredientsSubject */
  private ingredients : Ingredient[] = [];

  /* Acts like a read only getter so that components like shopping-list can listen to updates on our ingredientsSubject */
  getIngredientListState() {
    return this.ingredientsSubject.asObservable()
  }

  /** 
    * Like in Recipe Service, our http calls return observables that we subscribe to in our components.
    * These http observables only emit once and there is no need to unsubscribe manually. 
    */
  getAllIngredients() : Observable<Ingredient[]> {
    const url = this.apiUrl + '.json'
    return this.http.get<Ingredient[]>(url).pipe(
      map(data => {
       /**
        * Firebase data returns a JSON tree and we need to turn it into an array of objects 
        * {...body, id: id} uses spread syntax to copy all ingredient params but add an id param.  
        */
        return Object.entries(data).map(([id, body]) => ({...body, id: id}))
      }),
      /* Bit of a longer form of updating both our private ingredients array and updating our subject */
      tap(ingredients => {
        this.ingredients = ingredients;
        this.ingredientsSubject.next(this.ingredients)
        console.log('All ingredients retrieved', ingredients)
      }),
      catchError(this.handleError<Ingredient[]>('Retrieve all ingredients', []))
    )
  }

  /**
   * When we add an ingredient we try to look at our ingredients array to find for similar ingredient names.
   * If there is a match, we update the count. Else, we add the ingredient. Firebase returns its unique id 
   * on successful add. 
   */
  addIngredient(ing: Ingredient) : Observable<Ingredient> {
    const url = this.apiUrl + '.json'
    const ingWithSameName = this.ingredients.find(i => i.name.toLowerCase() === ing.name.toLowerCase())

    if(ingWithSameName) {
      ingWithSameName.quantity += ing.quantity
      return this.updateIngredient(ingWithSameName)
    } else {
      return this.http.post<Ingredient>(url, ing, this.httpOptions).pipe(
        tap(res => {
          /* Update the private ingredients array and also the subject so that a subscribed component will get the updates */
          this.ingredients.push({...ing, id:res.name})
          this.ingredientsSubject.next(this.ingredients)
        }),
        catchError(this.handleError<Ingredient>(`Add Ingredient with name = ${ing.name}`))
      )
    }
  }

  /**
   * Used when moving ingredients from a recipe to the shopping list.
   * Instead of doing a usual loop for each ingredient in the list, we can also use array.map
   * We then get an array of observables that we plug into rxjs forkJoin so that we get the results in an array
   * altogether kind of like Promise.all. 
   */
  addIngredients(ings: Ingredient[]) : Observable<Ingredient[]> {
    const ings$ = ings.map(ing => this.addIngredient(ing))
    return forkJoin(ings$).pipe(
      tap(result => console.log(`Added Multiple Ingredients`, result)),
      tap(_ => this.snackbar.show('Ingredients added to Shopping List')),
      catchError(this.handleError<Ingredient[]>(`Add Multiple Ingredients`, []))
    )
  }

  /* Quite straightforward delete. Firebase will return null on successful delete. */
  deleteIngredient(id: string) : Observable<Ingredient> {
    const url = this.apiUrl + `/${id}` + '.json'
    return this.http.delete<Ingredient>(url).pipe(
      tap(_ => {
        this.ingredients = this.ingredients.filter(i => i.id !== id)
        this.ingredientsSubject.next(this.ingredients)
        console.log('Ingredient deleted')
      }),
      catchError(this.handleError<Ingredient>(`Deleting ingredient with id ${id}`))
    )
  }

  /* We send the updated ingredient to firebase and then update our own ingredients array*/
  updateIngredient(ing: Ingredient) : Observable<Ingredient> {
    const url = this.apiUrl + `/${ing.id}` + '.json'
    return this.http.put<Ingredient>(url, ing, this.httpOptions).pipe(
      tap(result => {
        /* This is a shorthand way to use array.map to return as a copy of the array with the updated ingredient in it */
        const ingredients = this.ingredients.map(i => i.id === ing.id ? ing : i)
        this.ingredientsSubject.next(ingredients)
        console.log(`Ingredient with id=${ing.id} updated`, result)
      }),
      catchError(this.handleError<Ingredient>(`Updating ingredient with id ${ing.id}`))
    )
  }

  /* Placeholder error handler in case you need to log errors. For now, we just display the error in the console. */
  private handleError<T>(operation : string = 'operation', result?: T) {
    return (error : any) : Observable<T> => {
      console.error(operation, error);
      return of(result as T)
    }
  }

}
