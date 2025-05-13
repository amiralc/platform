import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// CoreUI Modules
import { AvatarModule } from '@coreui/angular';
import { TableModule } from '@coreui/angular';

import { ProjectsComponent } from './projects.component';// Adaptez le chemin selon votre structure

@NgModule({
  declarations: [
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    TableModule
  ],
  exports: [
   ProjectsComponent 
  ]
})
export class ProjectModule { }