import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage:string;
  spin:boolean = false;
  constructor(private fireAuth:AngularFireAuth, private router:Router) { }

  ngOnInit() {
  }
  onSubmit = async(form) => {
    try {
      this.spin = true;
      if(form.value.password != form.value.repeatPassword){
        throw new Error('Passwords dont match');
      }
      const user = await this.fireAuth.auth.createUserWithEmailAndPassword(form.value.email, form.value.password);
      console.log(user);
      this.spin = false;
      this.router.navigate(['login']);
    } catch (err) {
      this.errorMessage = err.message;
      this.spin = false;
    }
  }
}
