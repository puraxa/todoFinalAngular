import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  faEdit = faEdit;
  faTrash = faTrash;
  spin:boolean;
  width:boolean = false;
  items;
  editValue:string;
  doneItems;
  errorMessage:string;
  uploadPercentage;
  opened:string;
  constructor(private firestore:AngularFirestore,private storage:AngularFireStorage, private bottomSheet:MatBottomSheet, private snackBar:MatSnackBar) {
    this.items = firestore.collection('items',ref => ref.where('done','==',false).orderBy('dateCreated','desc')).valueChanges();
    this.doneItems = firestore.collection('items', ref => ref.where('done','==',true).orderBy('dateCreated','desc')).valueChanges();
  }
  @HostListener('window:resize',['$event'])
  onResize = (event) => {
    if(event.target.innerWidth < 576){
      return this.width = true;
    }
    this.width = false;
  }
  ngOnInit() {
    if(window.innerWidth < 576){
      this.width = true;
    }
  }
  closeOpen = () => {
    if(this.opened){
      this.firestore.collection('items').doc(this.opened).update({show: false, edit: false}).then(data => this.opened = null);
    }
  }
  openSnackBar = () => {
    this.snackBar.open(this.errorMessage,'OK');
  }
  openBottomSheet = () => {
    this.bottomSheet.open(BottomSheetComponent);
  }
  done = async(id) => {
    try {
      const data = await this.firestore
        .collection("items")
        .doc(id)
        .get()
        .toPromise();
      const done = data.data().done;
      await this.firestore
        .collection("items")
        .doc(id)
        .update({ done: !done });
    } catch (err) {
      this.errorMessage = err.message;
      this.openSnackBar();
    }
  }
  download = async(path) => {
    try {
      const url = await this.storage.ref(path).getDownloadURL().toPromise();
      window.open(url, '_blank');
    } catch (err) {
      this.errorMessage = err.message;
      this.openSnackBar();
    }
    // this.storage.ref(path).getDownloadURL();
    // window.open(url)
    // console.log(path);
  }
  drop = (event) => {
    if(event.container != event.previousContainer){
      this.done(event.item.element.nativeElement.id);
    }
  }
  edit = async(id) => {
    try {
      if(this.opened != id){
        await this.closeOpen();
      }
      const data = await this.firestore.collection('items').doc(id).get().toPromise();
      const edit = data.data().edit;
      await this.firestore.collection('items').doc(id).update({edit: !edit});
      this.opened = id;
    } catch (err) {
      this.errorMessage = err.message;
      this.openSnackBar();
    }
  }
  editItem = async(id) => {
    try {
      this.firestore.collection('items').doc(id).update({value: this.editValue});
      this.editValue = null;
    } catch (err) {
      this.errorMessage = err.message;
      this.openSnackBar();
    }
  }
  uploadFile = async(event) => {
    try {
      const response = await this.firestore.collection('items').doc(event.target.id).get().toPromise();
      let array = response.data().files;
      for(let i = 0; i < event.target.files.length; i++){
        if(response.data().files.findIndex(index => index.fileName === event.target.files[i].name)>-1){
          throw new Error('File ' + event.target.files[i].name + ' already exists on this item');
        }
      }
      for(let i = 0; i < event.target.files.length; i++){
        this.uploadPercentage = this.storage.upload(event.target.id + '/' + event.target.files[i].name,event.target.files[i]).percentageChanges();
        this.storage.upload(event.target.id + '/' + event.target.files[i].name,event.target.files[i]).snapshotChanges().pipe(finalize(()=>{
          this.firestore.collection('items').doc(event.target.id).update({files: array}); 
          this.uploadPercentage = null;
        })).subscribe();
        array.push({fileName: event.target.files[i].name, path: event.target.id + '/' + event.target.files[i].name});
      }
    } catch (err) {
      this.errorMessage = err.message;
      this.openSnackBar();
    }
  }
  showFiles = async(id) => {
    try {
      if(this.opened != id){
        await this.closeOpen();
      }
      const data = await this.firestore.collection('items').doc(id).get().toPromise();
      const show = data.data().show;
      await this.firestore.collection('items').doc(id).update({show: !show});
      this.opened = id;
    } catch (err) {
      this.errorMessage = err.message;
      this.openSnackBar();
    }
  }
  deleteItem = async(id) => {
    try {
      this.spin = true;
      const response = await this.firestore.collection('items').doc(id).get().toPromise();
      if (response.data().files.length > 0) {
        for (let i = 0; i < response.data().files.length; i++) {
          await this.deleteFile(id, response.data().files[i].path);
        }
      }
      await this.firestore.collection('items').doc(id).delete();
      this.spin = false;
    } catch (err) {
      this.errorMessage = err.message;
      this.spin = false;
      this.openSnackBar();
    }
  }
  deleteFile = async(id, path) => {
    try {
      const response = await this.firestore.collection('items').doc(id).get().toPromise();
      const currentFiles = response.data().files;
      const newFiles:Array<any> = [];
      for(let i = 0; i < currentFiles.length; i++){
        if(currentFiles[i].path != path){
          newFiles.push(currentFiles[i]);
        }
      }
      await this.firestore.collection('items').doc(id).update({files: newFiles});
      await this.storage.storage.ref(path).delete();
    } catch (err) {
      this.errorMessage = err.message;
      this.spin = false;
    }
  }
}