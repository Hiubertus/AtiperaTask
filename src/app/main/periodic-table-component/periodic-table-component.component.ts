import {Component, OnInit} from '@angular/core';
import {SearchTableComponent} from "../../components/search-table/search-table.component";
import {PeriodicElement} from "../../models/periodic-element.model";
import {PeriodicElementsService} from "../../services/periodic-elements.service";

@Component({
  selector: 'app-periodic-table-component',
  standalone: true,
  imports: [
    SearchTableComponent
  ],
  templateUrl: './periodic-table-component.component.html',
  styleUrl: './periodic-table-component.component.scss'
})
export class PeriodicTableComponent implements OnInit {
  periodicElements: PeriodicElement[] = [];

  constructor(private periodicElementsService: PeriodicElementsService) {}

  ngOnInit() {
    this.periodicElementsService.getPeriodicElements().subscribe(data => {
      this.periodicElements = data;
    });
  }
  updateRecord(event: { index: number, updatedRecord: PeriodicElement }) {
    this.periodicElements[event.index] = event.updatedRecord;
    this.periodicElements = [...this.periodicElements];
  }
}
