import { Component, OnInit, NgZone, OnChanges, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  customers: any;
  currentCustomer = null;
  currentIndex = -1;
  portalName = '';

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
    //SPKioskApp01
    //experigoclient@gmail.com
    this.auth.authState.subscribe(user => {
      console.log('asdasdasd: ' + user?.uid);
      var xperigoUID = "lkfkHKQhEzM9HgZQp9dZcs4mjPb2"
      if (user) {

         if (user.email == "client1@gmail.com") {
          this.portalName = "Xperigo - Moncton"
         } else if (user.email == "sparxclient@gmail.com") {
          this.portalName = "Sparx"
         } else if (user.email == "smartpodsclient@gmail.com") {
          this.portalName = "Smartpods"
         }  


        if (user?.email == "experigoclient@gmail.com") {
          this.portalName = "Xperigo - Moncton"
          this.retrieveCustomers(xperigoUID);
        } else {
          this.retrieveCustomers(user?.uid);
        }
        //this.retrieveCustomers(user?.uid);
      }
    });

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
      let groupdData: any[] = [];

      const datePipe = new DatePipe('en-US');
      data.forEach((key: any, val: any) => {
        const obj = JSON.parse(JSON.stringify(key));
        const myFormattedDate = datePipe.transform(obj.key, 'MMMM d, YYYY');
        key.datefilter = myFormattedDate;
        // console.log('key: ' + JSON.stringify(key));
        //console.log('val: ' + val);
        groupdData.push(key);
      });

      //group data
      var groups:{[key: string]: any[]} = {};

      groupdData.forEach(function (val: any) {
        if (val.datefilter in groups) {
          groups[val.datefilter].push(val);
        } else {
          groups[val.datefilter] = new Array(val);
        }
      });

      //console.log("Groupd data: " + JSON.stringify(groups));

      let presentableData: any[] = [];

      Object.keys(groups).forEach(key => {
        var _combine: {[key: string]: any} = {};
        _combine["key"] = key
        let value = groups[key];
        _combine["entries"] = value
        presentableData.push(_combine);

      });

      //this.customers = data;
      this.customers = presentableData.sort((a, b) => {
        return new Date(b.key).getTime() - new Date(a.key).getTime();
      });
      //console.log('presentableData key: ' + JSON.stringify(this.customers));
    });
  }

  // tslint:disable-next-line:typedef
  toggleCurrentDate(index: number) {
    let cust = this.customers[index];

    const datePipe = new DatePipe('en-US');
    let today: any = datePipe.transform(Date.now(), 'MMMM d, YYYY');
    let custDate: any = datePipe.transform(cust.key, 'MMMM d, YYYY');
    return (today === custDate);
  }
}
