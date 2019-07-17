import { Component, OnInit } from '@angular/core';
import { GlobalAuthService } from './global-auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todoAngular';
  constructor(private globals:GlobalAuthService){
  }
  
}
