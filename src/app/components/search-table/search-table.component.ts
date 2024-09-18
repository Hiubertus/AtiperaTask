import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Input } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { EditRecordDialogComponent} from "../edit-record-dialog/edit-record-dialog.component";

@Component({
  selector: 'app-search-table',
  standalone: true,
  imports: [MatTableModule, MatInputModule, NgxSkeletonLoaderModule, MatPaginatorModule],
  templateUrl: './search-table.component.html',
  styleUrl: './search-table.component.scss'
})

export class SearchTableComponent<T> implements OnInit, OnChanges {
  @Input() data: T[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() showPagination: boolean = true;
  @Input() skeletonSize: number = 5;
  @Output() recordUpdated = new EventEmitter<{ index: number, updatedRecord: T }>();

  dataSource = new MatTableDataSource<T>();
  skeletonDataSource = new MatTableDataSource();

  private paginator!: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  currentPageIndex: number = 0;
  pageSize: number = 10; // domyślny rozmiar strony, dostosuj według potrzeb

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.skeletonDataSource.data = Array(this.skeletonSize).fill({});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource.data = this.data;
      if (this.showPagination) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  openEditDialog(element: T, columnName: string, rowIndex: number) {
    const actualIndex = this.currentPageIndex * this.pageSize + rowIndex;
    const dialogRef = this.dialog.open(EditRecordDialogComponent, {
      width: '250px',
      data: { value: element[columnName as keyof T], columnName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedRecord = { ...element, [columnName]: result };
        this.recordUpdated.emit({ index: actualIndex, updatedRecord });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
