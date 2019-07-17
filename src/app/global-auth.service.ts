import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class GlobalAuthService {
  isCollapsed:true;
  loggedIn: boolean;
  constructor(private auth:AngularFireAuth) { }
  checkAuth = () => {
    this.auth.idTokenResult.subscribe(data => {
      if(data){
        return this.loggedIn = true;
      }
      return this.loggedIn = false;
    })
  }
}
