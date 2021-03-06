import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import Customers from './model/Customers';
import { AuthService } from './shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  authState: any = null;

  private dbPath = '/lkfkHKQhEzM9HgZQp9dZcs4mjPb2';
  customersRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase, private firebaseAuth: AngularFireAuth, public authService: AuthService) {
    this.firebaseAuth.authState.subscribe(authState => {
      this.authState = authState;
    });

    // if (this.authService.getUserId !== '') {
    //   console.log('DB PATH: ' + this.authService.getUserId);
    //   this.customersRef = db.list('/' + this.authService.getUserId);
    // } else {
    //   console.log('DB PATH: empty');
    //   this.customersRef = db.list(this.dbPath);
    // }
    console.log('Customer service: ' + JSON.stringify(this.firebaseAuth));

    this.firebaseAuth.authState.subscribe(user => {
      if(user) {
        //console.log('has user: ' + JSON.stringify(user));
        this.dbPath = user?.uid
        this.customersRef = db.list('/' + user?.uid);
        //this.customersRef = db.list(this.dbPath);
      } else {
        console.log('no user');
        this.customersRef = db.list(this.dbPath);
      }
    });

  }

  getAll(): AngularFireList<Customers> {
    return this.customersRef;
  }

  create(tutorial: Customers): any {
    return this.customersRef.push(tutorial);
  }

  update(key: string, value: any): Promise<void> {
    return this.customersRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.customersRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.customersRef.remove();
  }
}
