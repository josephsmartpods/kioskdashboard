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

  export() {
    this.exportService.exportExcel(this.customers, 'customers');
  }
}
