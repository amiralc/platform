import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// CoreUI Modules
import { AvatarModule } from '@coreui/angular';
import { TableModule } from '@coreui/angular';

// Components
import { StatisticsComponent } from './statistics.component';
import { ByuserComponent } from './byuser/byuser.component';
import { ByprojectComponent } from './byproject/byproject.component';

@NgModule({
  declarations: [
   StatisticsComponent,
   ByuserComponent,
   ByprojectComponent
   
  ],
  imports: [
    CommonModule,
    AvatarModule,
    TableModule
  ],
  exports: [
    StatisticsComponent ,
    ByuserComponent,
    ByprojectComponent,
  ]
})
export class StatisticsModule { }