import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SearchTableComponent} from "./components/MaterialTable/search-table/search-table.component";
import {PeriodicTableComponent} from "./main/periodic-table-component/periodic-table-component.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchTableComponent, PeriodicTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Atipera';
}
