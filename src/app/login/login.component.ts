import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage:string;
  spin:boolean;
  constructor(private fireAuth: AngularFireAuth, private router:Router) { }
  
  ngOnInit() {
  }
  onSubmit = async(form) => {
    try {
      this.spin = true;
      const user = await this.fireAuth.auth.signInWithEmailAndPassword(form.value.email, form.value.password);
      this.spin = false;
      this.router.navigate(['todolist']);
    } catch (err) {
      this.errorMessage = err.message;
      this.spin = false;
    }

  }
}
