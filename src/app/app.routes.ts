import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StatusupdateComponent } from './statusupdate/statusupdate.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {path:'',component: HomeComponent},
  {path:'updates',component: StatusupdateComponent}
];
