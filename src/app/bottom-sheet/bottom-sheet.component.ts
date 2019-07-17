import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit {
  uploadPercentage;
  constructor(private storage:AngularFireStorage, private auth:AngularFireAuth, private firestore:AngularFirestore, private bottomSheet:MatBottomSheet) { }

  ngOnInit() {
  }
  checkDuplicate = (array) => {
    console.log(array);
    let seen = {};
    for(let i = 0; i < array.length; i++){
      if(array[i].name in seen){
        return true;
      }
      seen[array[i].name] = true;
    }
    return false;
  }
  addItem = async(event) => {
    try {
      const id = this.firestore.createId();
      let files:Array<any> = [];
      for(let i = 0; i < event.target[1].files.length; i++){
        this.uploadPercentage = this.storage.upload(id+'/'+event.target[1].files[i].name,event.target[1].files[i]).percentageChanges();
        this.storage.upload(event.target[0].id + '/' + event.target[1].files[i].name,event.target[1].files[i]).snapshotChanges().pipe(finalize(()=>{
          this.uploadPercentage = null;
        })).subscribe();
        files.push({fileName: event.target[1].files[i].name, path: id+'/'+event.target[1].files[i].name});
      } 
      await this.firestore.collection('items').doc(id).set({id: id,value: event.target[0].value, done: false, edit: false, show: false, dateCreated: new Date(), files:files});
      this.bottomSheet.dismiss();
    } catch (err) {
      console.log(err);
    }
  }
}
