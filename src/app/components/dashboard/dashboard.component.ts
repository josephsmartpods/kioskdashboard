import { Component, OnInit, NgZone, OnChanges } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

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
    private customerService: CustomerService,
    public auth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    //console.log('authService : ' + JSON.stringify(this.auth.user));
    //this.retrieveCustomers();

  //   this.auth.idToken.subscribe(user => {
  //     //this.user = user;
  //     //this.lists = this.af.list(`/lists/${user.uid}`);

  //     console.log('asdasdasd: ' + user);
  // });

  this.auth.authState.subscribe(user => {
    console.log('asdasdasd: ' + user?.uid);
    if(user) {
      this.retrieveCustomers(user?.uid)
    }
  }) 

  }

  refreshList(): void {
    this.currentCustomer = null;
    this.currentIndex = -1;
    //this.retrieveCustomers();
  }

  retrieveCustomers(path: string): void {
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
