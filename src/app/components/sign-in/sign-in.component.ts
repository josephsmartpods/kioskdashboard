import { Component, OnInit, Inject} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from "@angular/router";
import { CustomDialogComponent, DialogData } from '../custom-dialog/custom-dialog.component'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  showloader = false;
  allDocsInCollection: Observable<any[]>; 
  singleDoc: Observable<any>;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public afs: AngularFirestore
  ) { 
    this.allDocsInCollection = afs.collection("users").valueChanges();
  }

  // tslint:disable-next-line:typedef
  ngOnInit() { }

  authenticateUser(username: any, pass: any) {
    if (username == "" || pass == "") {
      this.showAlertDialog("Error","Invalid username or password. Please try again.");
      return;
    }

    this.showloader = true;

    //this.authService.SignIn(username, pass);

    this.authService.SignIn(username, pass)
      .then((res) => {
         
         console.log("login response: " + JSON.stringify(res));
         console.log("user id: " + res.user?.uid);
         //this.router.navigate(['dashboard']);
         
         //var userObject = this.afs.collectionGroup('users', ref => ref.where('uid', '==', res.user?.uid));

          //var userObject = this.afs.collection('users', ref => ref.where('uid', '==', res.user?.uid).limit(1))
          this.getUserObject(res.user?.uid)

         //console.log("userObject: " + JSON.stringify(userObject));
         
         this.showloader = false;
      })
      .catch((err) =>{
        this.showloader = false;
        console.log('error signin: ' + err)
        this.showAlertDialog("Error",err);
      });

  }

  showAlertDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
       disableClose: true,
       autoFocus: true,
       data: {alertTitle: title, alertMessage: message}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getUserObject(uid: any) {
      this.afs.collection('users', ref => ref.where('uid', '==', uid))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
           let _data: any = doc.data();
            console.log('doc object role: ', _data.role)

            if (_data.role == "1") {
              this.router.navigate(['admin-dashboard']);
            } else {
              this.router.navigate(['dashboard']);
            }
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }

}