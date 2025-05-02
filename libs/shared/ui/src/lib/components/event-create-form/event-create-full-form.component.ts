import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScheduledEvent } from '@angular-monorepo/models-calendar';
import { scheduledEventFactory } from '@angular-monorepo/factories-calendar';
import { createDateWithSpecifiedTime } from '@angular-monorepo/utils-calendar';
import {
  catchError,
  filter,
  finalize,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  IDeletePermissions,
  IScheduledEvent,
  IUserInfo,
} from '@angular-monorepo/types-calendar';
import {
  SessionService,
  UserAPIService,
} from '@angular-monorepo/services-calendar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'lib-event-create-full-form',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    NgIf,
    NgxSkeletonLoaderModule,
    AsyncPipe,
  ],
  templateUrl: './event-create-full-form.component.html',
  styleUrl: './event-create-full-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCreateFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() date!: Date;
  @Input() eventDetails: IScheduledEvent | undefined;
  @Input() isDeletable!: IDeletePermissions;
  @Input() selectedAttendees: WritableSignal<IUserInfo[]> = signal([]);

  @Output() submitFormValue: EventEmitter<ScheduledEvent> =
    new EventEmitter<ScheduledEvent>();
  @Output() deleteItem: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('attendeeInput') attendeeInput!: ElementRef<HTMLInputElement>;

  isDisabledSubmitBtn = true;
  createdEvent!: ScheduledEvent | null;
  readonly searchFragment = new FormControl<string>('');
  readonly lengthOfTitle = 50;
  attendeeList$: Observable<IUserInfo[]>;
  private destroy$ = new Subject();

  eventForm!: FormGroup;
  private _validSpecifiedHour!: string;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private userService: UserAPIService,
    private cdr: ChangeDetectorRef
  ) {}

  get formControlsTitle(): { [key: string]: AbstractControl<string> } {
    return this.eventForm.controls;
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.initForm();
    this.formChangesListening();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['eventDetails']?.currentValue) {
      this.setForm(changes['eventDetails'].currentValue);
    }
  }

  initForm(): void {
    if (!this.eventForm) {
      this.eventForm = this.fb.group({
        title: [
          '',
          [Validators.required, Validators.maxLength(this.lengthOfTitle)],
        ],
        time: ['', Validators.required],
        attendees: [[]],
      });
      this.eventForm.disable();
    }
  }

  /***************************************************************************
   *  ACTIONS
   ****************************************************************************/

  removeAttendee(attendee: IUserInfo): void {
    const attendees = this.eventForm.get('attendees')?.value;
    const index = attendees.indexOf(attendee.id);
    if (index >= 0) {
      attendees.splice(index, 1);
      this.eventForm.get('attendees')?.setValue(attendees);
    }
    const leftAttendees = attendees.filter(
      (attendeeId: string) => attendeeId !== this.eventDetails?.ownerId
    );
    this.selectedAttendees.update(() =>
      this.selectedAttendees().filter(
        (attendee: IUserInfo) => leftAttendees.indexOf(attendee.id) > -1
      )
    );
  }

  selectedAttendee(event: MatAutocompleteSelectedEvent): void {
    const attendeeIds = new Set(
      this.selectedAttendees().map((attendee) => attendee.id)
    );
    if (attendeeIds.has(event.option.value.id)) {
      return;
    }
    attendeeIds.add(event.option.value.id);

    this.searchFragment.setValue(null);
    this.selectedAttendees.update((attendees) => [
      ...attendees,
      event.option.value,
    ]);
    this.eventForm.get('attendees')?.setValue(Array.from(attendeeIds));
    if (this.attendeeInput) {
      this.attendeeInput.nativeElement.value = '';
    }
    event.option.deselect();
  }

  setForm(values: ScheduledEvent): void {
    if (this.eventForm) {
      this.eventForm.patchValue({
        title: values.content,
        time: values.preciseTime,
        attendees: values.attendees,
      });
      this.eventForm.enable();
      this.eventForm.updateValueAndValidity();
    } else {
      this.initForm();
      this.setForm(values);
    }
  }

  submitForm(): void {
    this.isDisabledSubmitBtn = true;
    const formValue = this.eventForm.value;
    const [hours, minutes] = formValue.time.split(':');
    const eventId: string =
      this.eventDetails?.id || this.createdEvent?.id || '';
    const isEditable =
      this.eventDetails?.editable || this.createdEvent?.editable || false;
    const attendees =
      formValue.attendees.indexOf(this.sessionService.getUserId()) > -1
        ? formValue.attendees
        : [...formValue.attendees, this.sessionService.getUserId()];

    const newEvent = this.createEventFrom(
      hours,
      minutes,
      formValue.title,
      isEditable,
      eventId,
      attendees,
      this.sessionService.getUserId()
    );

    this.submitFormValue.emit(newEvent);

    if (this._validSpecifiedHour) {
      this.eventForm.reset({
        title: '',
        time: this._validSpecifiedHour + ':00',
      });
      this.createdEvent = null;
    } else {
      this.eventForm.reset(null, { emitEvent: false });
      this.eventForm.disable();
    }
  }

  deleteEvent(): void {
    this.isDisabledSubmitBtn = true;
    this.deleteItem.emit(this.eventDetails?.id);
    this.eventForm.reset(null, { emitEvent: false });
    this.eventForm.disable();
  }

  formChangesListening(): void {
    this.eventForm
      .get('time')
      ?.valueChanges.pipe(
        filter((value) => !!value),
        filter((value) => Object.values(value).some((v) => v)),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        // this.isDisabledSubmitBtn = !value.title || !value.time;
        const hours = value.split(':')[0];
        if (this._validSpecifiedHour && hours !== this._validSpecifiedHour) {
          this.eventForm
            .get('time')
            ?.setValue(`${this._validSpecifiedHour}${value.time.slice(2)}`);
        }
      });

    this.attendeeList$ = this.searchFragment.valueChanges.pipe(
      startWith<string | null>(''),
      filter(
        (value: string | null): value is string =>
          typeof value === 'string' && value.trim().length > 3
      ),
      switchMap((value: string) => {
        return this.userService
          .searchUser(value)
          .pipe(catchError(() => of([])));
      }),
      takeUntil(this.destroy$)
    );
  }

  /***************************************************************************
   *  HELPERS
   ****************************************************************************/

  private createEventFrom(
    hours: number,
    minutes = 0,
    content: string,
    isEditable: boolean,
    id: string,
    attendees: string[] = [],
    ownerId: string
  ): ScheduledEvent {
    return scheduledEventFactory({
      date: createDateWithSpecifiedTime(this.date, hours, minutes),
      content,
      editable: isEditable,
      id,
      attendees,
      ownerId,
    });
  }
}
