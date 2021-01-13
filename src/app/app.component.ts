import { Component, OnInit } from '@angular/core';
import { ExportService } from './export.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Kiosk Dashboard';

  customers: any = [];
  constructor(private exportService: ExportService) { }

  // ngOnInit() {
  //   for (let i = 0; i <= 25; i++) {
  //     this.customers.push({firstName: `first${i}`, lastName: `last${i}`,
  //     email: `abc${i}@gmail.com`, address: `000${i} street city, ST`, zipcode: `0000${i}`});
  //   }
  // }

  // tslint:disable-next-line:typedef
  export() {
    this.exportService.exportExcel(this.customers, 'customers');
  }
}
