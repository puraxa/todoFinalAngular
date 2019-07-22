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
  uploading:Array<any> = [];
  files:Array<any> = [];
  counter:number = 0;
  disabled:boolean;
  constructor(private storage:AngularFireStorage, private auth:AngularFireAuth, private firestore:AngularFirestore, private bottomSheet:MatBottomSheet) { }

  ngOnInit() {
  }
  addItem = async(event) => {
    try {
      this.disabled = true;
      const id = this.firestore.createId();
      let files:Array<any> = [];
      const forUpload = event.target[1].files;
      for(let i = 0; i < forUpload.length; i++){
        this.uploading.push({progress:0, name:forUpload[i].name});
        this.uploadFile(id,forUpload[i],i);
        files.push({fileName: forUpload[i].name, path: id+'/'+forUpload[i].name});
      }
      let interval = setInterval(()=>{
        if(this.counter == forUpload.length){
          this.firestore.collection('items').doc(id).set({id: id,value: event.target[0].value, done: false, edit: false, show: false, dateCreated: new Date(), files:files});
          this.bottomSheet.dismiss();
          this.disabled = false;
          clearInterval(interval);
        }
      },1500);
    } catch (err) {
      console.log(err);
      this.disabled = false;
    }
  }
  uploadFile = (id, file, index) => {
    this.uploading[index].progress = this.storage.upload(id+'/'+file.name,file).percentageChanges();
    this.storage.upload(id + '/' + file.name,file).snapshotChanges().pipe(finalize(()=>{
      this.counter++;
    })).subscribe();
  }
}
