import { Validators, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-confirmation-dialog-entity',
  templateUrl: './confirmation-dialog-entity.component.html',
  styleUrls: ['./confirmation-dialog-entity.component.css']
})
export class ConfirmationDialogEntityComponent implements OnInit {


  statusMessage: string = "";
messageType: string = "";
serverError: boolean = false;
commentForm: FormGroup = new FormGroup({comments: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(255)])});
  constructor(  public dialogRef: MatDialogRef<ConfirmationDialogEntityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.statusMessage = this.data.message;
    this.messageType = this.data.type;
    if(this.statusMessage == undefined){
    this.serverError = true;
    }
  }

  onNoClick(status): void {
  this.dialogRef.close(status);
  }

addComments(status){
  this.dialogRef.close({comments: this.commentForm.value.comments, status: status});
}


}
