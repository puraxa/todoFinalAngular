import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TodolistComponent } from './todolist/todolist.component';
import { AngularFireAuthGuard, canActivate, loggedIn, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectLoggedInToTodo = redirectLoggedInTo(['todolist']);
const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {path: '',redirectTo:'login',pathMatch: 'full'},
  {path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToTodo)},
  {path: 'register', component: RegisterComponent, ...canActivate(redirectLoggedInToTodo)},
  {path: 'todolist', component: TodolistComponent, ...canActivate(redirectUnauthorizedToLogin)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
