import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// CoreUI Modules
import { AvatarModule } from '@coreui/angular';
import { TableModule } from '@coreui/angular';

// Components
import { StatisticsComponent } from './statistics.component';// Adaptez le chemin selon votre structure

@NgModule({
  declarations: [
   StatisticsComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    TableModule
  ],
  exports: [
    StatisticsComponent // Optionnel - seulement si vous voulez l'utiliser ailleurs
  ]
})
export class StatisticsModule { }