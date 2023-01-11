import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AlertComponent } from "./alert/alert.component";

import { DropdownDirective } from "./dropdown.directive";

@NgModule({
  imports: [CommonModule],
  declarations:[DropdownDirective, AlertComponent],
  exports: [DropdownDirective, AlertComponent, CommonModule, ReactiveFormsModule]
})

export class SharedModule {}