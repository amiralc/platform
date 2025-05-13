import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// CoreUI Modules
import { AvatarModule } from '@coreui/angular';
import { TableModule } from '@coreui/angular';

// Components
import { UserProfileComponent } from './userprofile.component';  // Vérifiez le chemin de votre composant

@NgModule({
  declarations: [
    UserProfileComponent// Le composant que vous avez dans ce module
  ],
  imports: [
    CommonModule,
    AvatarModule,  // Assurez-vous d'importer les modules CoreUI nécessaires
    TableModule
  ],
  exports: [
    UserProfileComponent // Exporter le composant si nécessaire
  ]
})
export class UserProfileModule { }
