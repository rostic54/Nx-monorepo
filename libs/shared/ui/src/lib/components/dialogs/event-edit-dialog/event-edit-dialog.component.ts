import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  IEventDialogData,
  IScheduledEvent,
} from '@angular-monorepo/types-calendar';
import { EventCreateFormComponent } from '../../event-create-form/event-create-form.component';
import { DateManagerService } from '@angular-monorepo/services-calendar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'lib-event-edit-dialog',
  standalone: true,
  imports: [MatButton, EventCreateFormComponent],
  templateUrl: './event-edit-dialog.component.html',
  styleUrl: './event-edit-dialog.component.scss',
})
export class EventEditDialogComponent {
  appointment: IScheduledEvent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IEventDialogData,
    private dialogRef: MatDialogRef<EventEditDialogComponent>,
    private dateManagerService: DateManagerService
  ) {
    this.appointment = data.appointment;
  }

  createOrUpdateEvent(eventDetails: IScheduledEvent) {
    this.dateManagerService.createOrUpdateScheduledEvent(eventDetails);
  
    this.closeDialog(`Appointment ${eventDetails.preciseTime} was edited`);
  }

  deleteEvent(eventId: string): void {
    this.dateManagerService
      .deleteEventFromStore(eventId)
      .subscribe((result) => {
        this.closeDialog(
          result
            ? `Appointment at ${this.appointment.preciseTime} was deleted`
            : 'Appointment was not deleted'
        );
      });
  }

  closeDialog(result: string | null): void {
    this.dialogRef.close(result);
  }
}
