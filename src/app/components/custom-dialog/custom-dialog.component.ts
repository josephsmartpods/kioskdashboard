import { Component, Injectable, ViewChild, OnInit,Inject} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css']
})


export class CustomDialogComponent implements OnInit {

  alertTitle = ''
  alertMessage = '';

  //constructor(public dialog: MatDialog) {}

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
 ) {}

  ngOnInit(): void {
    console.log("dialog data is : " + JSON.stringify(this.data));
    this.alertTitle = this.data.alertTitle
    this.alertMessage = this.data.alertMessage
    console.log("local dialog data is : " + this.alertTitle + " message " + this.alertMessage);
  }
}

export interface DialogData {
  alertTitle: string;
  alertMessage: string;
}
