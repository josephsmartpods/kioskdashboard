import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  customers: any;
  currentCustomer = null;
  currentIndex = -1;
  title = '';

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private customerService: CustomerService
  ) { }

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


}
