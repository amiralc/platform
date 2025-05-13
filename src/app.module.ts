import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { UserlistComponent } from './app/views/userlist/userlist.component'; // Import du composant Userlist
import { CommonModule } from '@angular/common'; // Import de CommonModule pour les directives Angular comme *ngFor
import { RouterModule } from '@angular/router'; // Import pour le routage si nécessaire
import { UserProfileComponent } from './app/views/userprofile/userprofile.component';
import { TaskComponent } from './app/views/task/task.component';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
/*
@NgModule({
  declarations: [
   // AppComponent,
    //UserlistComponent,
    //UserProfileComponent,
    //TaskComponent,
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    IconModule, 
    RouterModule.forRoot([]),
    HttpClientModule
  ],
  providers: [ IconSetService,AuthService],
  bootstrap: [AppComponent],
})*/
export class AppModule {}
