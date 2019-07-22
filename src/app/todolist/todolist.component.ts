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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeletemodalComponent } from '../deletemodal/deletemodal.component';
import { DeletefilemodalComponent } from '../deletefilemodal/deletefilemodal.component';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  uploading:Array<any> = [];
  counter:number = 0;
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
  constructor(private firestore:AngularFirestore,private storage:AngularFireStorage, private bottomSheet:MatBottomSheet, private snackBar:MatSnackBar, public modal:NgbModal) {
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
  //set item as !done
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
  //gets download url for file and opens it
  download = async(path) => {
    try {
      const url = await this.storage.ref(path).getDownloadURL().toPromise();
      window.open(url, '_blank');
    } catch (err) {
      this.errorMessage = err.message;
      this.openSnackBar();
    }
  }
  // drop event for drag and drop
  drop = (event) => {
    if(event.container != event.previousContainer){
      this.done(event.item.element.nativeElement.id);
    }
  }
  //shows edit menu
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
  //edits item value
  editItem = async(id) => {
    try {
      this.firestore.collection('items').doc(id).update({value: this.editValue});
      this.editValue = null;
    } catch (err) {
      this.errorMessage = err.message;
      this.openSnackBar();
    }
  }
  //handles uploading files
  uploadFile = async(event) => {
    try {
      const response = await this.firestore.collection('items').doc(event.target.id).get().toPromise();
      let array = response.data().files;
      let forUpload = event.target.files;
      for(let i = 0; i < event.target.files.length; i++){
        if(response.data().files.findIndex(index => index.fileName === event.target.files[i].name)>-1){
          throw new Error('File ' + event.target.files[i].name + ' already exists on this item');
        }
      }
      for(let i = 0; i < event.target.files.length; i++){
        this.uploading.push({progress:0, name:forUpload[i].name});
        this.uploadingFiles(event.target.id,forUpload[i],i);
        array.push({fileName: event.target.files[i].name, path: event.target.id + '/' + event.target.files[i].name});
      }
      let interval = setInterval(()=>{
        if(this.counter == forUpload.length){
          this.firestore.collection('items').doc(event.target.id).update({files: array, edit: false, show: true}); 
          this.uploading = [];
          this.counter = 0;
          clearInterval(interval);
        }
      },1500);
    } catch (err) {
      this.errorMessage = err.message;
      this.openSnackBar();
    }
  }
  //creates proggres for every file that is selected for upload
  uploadingFiles = (id, file, index) => {
    this.uploading[index].progress = this.storage.upload(id+'/'+file.name,file).percentageChanges();
    this.storage.upload(id + '/' + file.name,file).snapshotChanges().pipe(finalize(()=>{
      this.counter++;
    })).subscribe();
  }
  //show preview for files
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
  // deletes item and all files attached to that item
  deleteItem = async(id) => {
    try {
      await this.modal.open(DeletemodalComponent,{centered:true}).result;
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
      if(err.message){
        this.errorMessage = err.message;
        this.spin = false;
        this.openSnackBar();
      }
    }
  }
  // deletes individual files
  deleteFile = async(id, path) => {
    try {
      await this.modal.open(DeletefilemodalComponent,{centered:true}).result;
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
      if(err.message){
        this.errorMessage = err.message;
        this.openSnackBar();
        this.spin = false;
      }
    }
  }
}