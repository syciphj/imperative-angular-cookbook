import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { ShoppingListComponent } from "./shopping-list.component";

const shoppinglistRoutes : Routes = [
  {path: 'shopping-list', component: ShoppingListComponent},
]

@NgModule({
  imports: [RouterModule.forChild(shoppinglistRoutes)],
  exports: [
    RouterModule
  ]
})

export class ShoppingListRoutingModule {}