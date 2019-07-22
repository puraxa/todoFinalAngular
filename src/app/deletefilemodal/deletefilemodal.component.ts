import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deletefilemodal',
  templateUrl: './deletefilemodal.component.html',
  styleUrls: ['./deletefilemodal.component.css']
})
export class DeletefilemodalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
