import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from '../customer.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {

  customers: any;
  currentCustomer = null;
  currentIndex = -1;
  title = '';

  /*constructor() { }

  @Input() customers: any;

  ngOnInit(): void {
  }*/

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.retrieveCustomers();
  }

  refreshList(): void {
    this.currentCustomer = null;
    this.currentIndex = -1;
    this.retrieveCustomers();
  }

  retrieveCustomers(): void {
    this.customerService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.customers = data;
    });
  }

  setActiveTutorial(cust: any, index: any): void {
    this.currentCustomer = cust;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this.customerService.deleteAll()
      .then(() => this.refreshList())
      .catch(err => console.log(err));
  }

}
