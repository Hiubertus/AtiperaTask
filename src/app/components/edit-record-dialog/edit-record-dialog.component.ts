import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-record-dialog',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogContent, MatDialogActions, MatDialogTitle, MatDialogClose],
  templateUrl: `edit-record-dialog.component.html`,
  styleUrl: 'edit-record-dialog.component.scss'
})
export class EditRecordDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditRecordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { value: any; columnName: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
