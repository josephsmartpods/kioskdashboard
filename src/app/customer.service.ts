import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import Customers from './model/Customers';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private dbPath = '/lkfkHKQhEzM9HgZQp9dZcs4mjPb2';
  customersRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.customersRef = db.list(this.dbPath);
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
