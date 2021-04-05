import { Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { map, retry } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { DatePipe } from '@angular/common';
import {FormGroup, FormControl} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from "rxjs";


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  allDocsInCollection: Observable<any[]>; 
  singleDoc: Observable<any>;
  customers: any[] = [];

  constructor(
    public authService: AuthService,
    public router: Router,
    private customerService: CustomerService,
    public auth: AngularFireAuth,
    public afs: AngularFirestore,
    private changeDetectorRef: ChangeDetectorRef) { 
      this.allDocsInCollection = afs.collection("users").valueChanges();
    }

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  ngOnInit(): void {
    this.retrieveUsers()
  }

  retrieveUsers(): void {
    this.afs.collection('users', ref => ref.where('active', '==', "1"))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
           let userObj: any = doc.data();
            
            this.customers.push(userObj);
            
        });
        console.log('this.customers object: ', this.customers);
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }
}
