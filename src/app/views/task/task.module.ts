import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// CoreUI Modules
import { AvatarModule } from '@coreui/angular';
import { TableModule } from '@coreui/angular';

// Components
import { TaskComponent } from './task.component';

@NgModule({
  declarations: [
   TaskComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    TableModule
  ],
  exports: [
   TaskComponent// Optionnel - seulement si vous voulez l'utiliser ailleurs
  ]
})
export class TaskModule { }