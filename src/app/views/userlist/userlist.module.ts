import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// CoreUI Modules
import { 
  AvatarModule,
  TableModule,
  UtilitiesModule,
  ButtonModule,
  CardModule,
  GridModule,
  BadgeModule
} from '@coreui/angular';

// Composant Userlist
import { UserlistComponent } from './userlist.component';

@NgModule({
  declarations: [
    UserlistComponent
  ],
  imports: [
    CommonModule,  // Assure-toi que CommonModule est bien importé
    AvatarModule,  // Pour utiliser c-avatar
    TableModule,   // Pour utiliser les tables avec CoreUI
    UtilitiesModule,
    ButtonModule,
    CardModule,
    GridModule,
    BadgeModule,
    RouterModule.forChild([
      { path: '', component: UserlistComponent }
    ])
  ]
})
export class UserlistModule { }
