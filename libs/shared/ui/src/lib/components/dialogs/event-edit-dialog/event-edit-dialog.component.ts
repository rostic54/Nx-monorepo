import {
  Component,
  Inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  IEventDialogData,
  IScheduledEvent,
  IUserInfo,
} from '@angular-monorepo/types-calendar';
import { EventCreateFormComponent } from '../../event-create-form/event-create-full-form.component';
import {
  DateManagerService,
  UserAPIService,
} from '@angular-monorepo/services-calendar';
import { MatButton } from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { finalize, Observable } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'lib-event-edit-dialog',
  standalone: true,
  imports: [MatButton, EventCreateFormComponent, NgxSkeletonLoaderModule, NgIf],
  templateUrl: './event-edit-dialog.component.html',
  styleUrl: './event-edit-dialog.component.scss',
})
export class EventEditDialogComponent implements OnInit {
  appointment: IScheduledEvent;
  isLoading = signal(false);
  selectedAttendees: WritableSignal<IUserInfo[]> = signal([]);

  testHusky = 'test husky!!';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IEventDialogData,
    private dialogRef: MatDialogRef<EventEditDialogComponent>,
    private dateManagerService: DateManagerService,
    private userService: UserAPIService
  ) {}

  ngOnInit(): void {
    this.appointment = this.data.appointment;
    if (this.appointment.attendees.length > 1) {
      this.isLoading.set(true);
      const attendeeIds = this.appointment.attendees.filter(
        (attendee) => attendee !== this.appointment.ownerId
      );

      this.getAttendeesDetailedInfo(attendeeIds)
        .pipe(finalize(() => setTimeout(() => this.isLoading.set(false), 1000)))
        .subscribe({
          next: (users: IUserInfo[]) => this.selectedAttendees.set(users),
          error: () => console.error('Error fetching attendees'),
        });
    }
  }

  /***************************************************************************
   *  ACTIONS
   ****************************************************************************/

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

  /***************************************************************************
   *  HELPERS
   ****************************************************************************/

  private getAttendeesDetailedInfo(
    attendees: string[]
  ): Observable<IUserInfo[]> {
    return this.userService.getAttendeesById(attendees.join(','));
  }
}
