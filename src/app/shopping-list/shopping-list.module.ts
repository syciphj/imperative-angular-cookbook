import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ShoppingAddComponent } from "./shopping-add/shopping-add.component";
import { ShoppingListRoutingModule } from "./shopping-list-routing.module";
import { ShoppingListComponent } from "./shopping-list.component";

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingAddComponent
  ],
  imports: [
    SharedModule,
    ShoppingListRoutingModule
  ]
})

export class ShoppingListModule {}