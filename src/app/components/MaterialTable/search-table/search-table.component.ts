import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Input } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { EditRecordDialogComponent} from "../edit-record-dialog/edit-record-dialog.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-search-table',
  standalone: true,
  imports: [MatTableModule, MatInputModule, NgxSkeletonLoaderModule, MatPaginatorModule, ReactiveFormsModule, MatProgressSpinner],
  templateUrl: './search-table.component.html'
})
export class SearchTableComponent<T> implements OnInit, OnChanges, OnDestroy {
  @Input() data: T[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() showPagination: boolean = true;
  @Input() skeletonSize: number = 5;
  @Output() recordUpdated = new EventEmitter<{ index: number, updatedRecord: T }>();

  dataSource = new MatTableDataSource<T>();
  skeletonDataSource = new MatTableDataSource();

  filterControl = new FormControl('');
  private destroy$ = new Subject<void>();

  private paginator!: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  currentPageIndex: number = 0;
  pageSize: number = 10;
  isFiltering: boolean = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.skeletonDataSource.data = Array(this.skeletonSize).fill({});
    this.setupFilter();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource.data = this.data;
      if (this.showPagination) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupFilter() {
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(filterValue => {
      this.isFiltering = true;
      setTimeout(() => {
        this.applyFilter(filterValue);
        this.isFiltering = false;
      }, 2000);
    });
  }

  applyFilter(filterValue: string | null) {
    this.dataSource.filter = filterValue?.trim().toLowerCase() || '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
