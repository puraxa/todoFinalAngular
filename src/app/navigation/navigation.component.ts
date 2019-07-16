import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GlobalAuthService } from '../global-auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private auth:AngularFireAuth, private router:Router, private globalAuth:GlobalAuthService) { }

  ngOnInit() {
    this.globalAuth.checkAuth();
  }
  logout = () => {
    this.auth.auth.signOut()
      .then(data => {
        this.router.navigate(['login']);
      });
  }
}
