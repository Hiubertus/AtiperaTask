import {Component} from '@angular/core';
import { RxState } from '@rx-angular/state';
import {SearchTableComponent} from "../../components/MaterialTable/search-table/search-table.component";
import {PeriodicElement} from "../../models/periodic-element.model";
import {PeriodicElementsService} from "../../services/periodic-elements.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-periodic-table-component',
  standalone: true,
  imports: [
    SearchTableComponent,
    AsyncPipe,
  ],
  templateUrl: './periodic-table-component.component.html',
  styleUrl: './periodic-table-component.component.scss',
  providers: [RxState]
})
export class PeriodicTableComponent {
  periodicElements$ = this.state.select('periodicElements');

  constructor(private state: RxState<{ periodicElements: PeriodicElement[] }>, private periodicElementsService: PeriodicElementsService) {
    this.state.connect('periodicElements', this.periodicElementsService.getPeriodicElements());
  }

  updateRecord(event: { index: number, updatedRecord: PeriodicElement }) {
    this.state.set({
      periodicElements: this.state.get().periodicElements.map((element, i) =>
        i === event.index ? event.updatedRecord : element
      )
    });
  }
}
