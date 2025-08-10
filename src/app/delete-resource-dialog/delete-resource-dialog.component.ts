import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import {Dialog, DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-resource-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete-resource-dialog.component.html',
  styleUrl: './delete-resource-dialog.component.scss'
})
export class DeleteResourceDialogComponent {
  dialogRef = inject(DialogRef);
  data = inject(DIALOG_DATA);
}
