import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// CoreUI Modules
import { AvatarModule } from '@coreui/angular';
import { TableModule } from '@coreui/angular';

// Components
import { UserprofileComponent  } from './userprofile.component';  

@NgModule({
  declarations: [
   UserprofileComponent 
  ],
  imports: [
    CommonModule,
    AvatarModule,  
    TableModule
  ],
  exports: [
    UserprofileComponent
  ]
})
export class UserProfileModule { }
