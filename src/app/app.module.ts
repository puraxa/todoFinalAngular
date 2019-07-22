import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop'; 
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'; 
import { MatFileUploadModule } from 'angular-material-fileupload';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment';
import { RegisterComponent } from './register/register.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { TodolistComponent } from './todolist/todolist.component';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DeletemodalComponent } from './deletemodal/deletemodal.component';
import { DeletefilemodalComponent } from './deletefilemodal/deletefilemodal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SpinnerComponent,
    TodolistComponent,
    BottomSheetComponent,
    NavigationComponent,
    DeletemodalComponent,
    DeletefilemodalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatButtonModule,
    AngularFireAuthModule,
    MatProgressSpinnerModule,
    AngularFireStorageModule,
    MatTabsModule,
    DragDropModule,
    MatBottomSheetModule,
    MatFileUploadModule,
    AngularFirestoreModule,
    MatSnackBarModule,
    AngularFireAuthGuardModule,
    MatProgressBarModule,
    NgbModule,
    FontAwesomeModule
  ],
  entryComponents:[
    BottomSheetComponent,
    DeletemodalComponent,
    DeletefilemodalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
