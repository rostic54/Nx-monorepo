import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'lib-app-important-date-details-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatButton,
    MatFormField
  ],
  templateUrl: './important-date-details-dialog.component.html',
  styleUrl: './important-date-details-dialog.component.css'
})
export class ImportantDateDetailsDialogComponent {
  constructor(public dialogRef: MatDialogRef<ImportantDateDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {formGroup: FormGroup}) {
    // this.data
  }
// public onsubmit() {
//
// }
}
