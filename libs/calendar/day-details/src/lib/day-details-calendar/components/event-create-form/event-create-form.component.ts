import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScheduledEvent } from '@angular-monorepo/models-calendar';
import { scheduledEventFactory } from '@angular-monorepo/factories-calendar';
import { createDateWithSpecifiedTime } from '@angular-monorepo/utils-calendar';
import { filter, Subject, takeUntil } from 'rxjs';
import { NgIf } from '@angular/common';
import {
  IDeletePermissions,
  IScheduledEvent,
} from '@angular-monorepo/types-calendar';
import { SessionService } from '@angular-monorepo/services-calendar';

@Component({
  selector: 'lib-event-create-form',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './event-create-form.component.html',
  styleUrl: './event-create-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCreateFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() date!: Date;
  @Input() eventDetails: IScheduledEvent | undefined;
  @Input() specificHour!: { hours: string };
  @Input() isDeletable!: IDeletePermissions;
  @Output() submitFormValue: EventEmitter<IScheduledEvent> =
    new EventEmitter<IScheduledEvent>();
  @Output() deleteItem: EventEmitter<string> = new EventEmitter<string>();
  isDisabledSubmitBtn = true;
  createdEvent!: IScheduledEvent | null;
  lengthOfTitle = 50;
  private destroy$ = new Subject();

  eventForm!: FormGroup;
  private _validSpecifiedHour!: string;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService
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
    } else if (changes['specificHour']?.currentValue.hours) {
      this._validSpecifiedHour = this.specificHour.hours.padStart(2, '0');
      this.createdEvent = this.createNewEvent(
        +changes['specificHour']?.currentValue.hours
      );
      this.setForm(this.createdEvent);
    }
    this.formChangesListening();
  }

  initForm(): void {
    if (!this.eventForm) {
      this.eventForm = this.fb.group({
        title: [
          '',
          [Validators.required, Validators.maxLength(this.lengthOfTitle)],
        ],
        time: ['', Validators.required],
      });
      this.eventForm.disable();
    }
  }

  setForm(values: IScheduledEvent): void {
    if (this.eventForm) {
      this.eventForm.patchValue({
        title: values.content,
        time: values.preciseTime,
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
    const eventId: string | undefined =
      this.eventDetails?.id || this.createdEvent?.id;
    const isEditable =
      this.eventDetails?.editable || this.createdEvent?.editable || false;
    const newEvent = this.createEventFrom(
      hours,
      minutes,
      formValue.title,
      isEditable,
      eventId || ''
    );
    newEvent.ownerId = this.sessionService.getUserId();
    console.log('CREATED EVENT:', newEvent);
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
    this.eventForm?.valueChanges
      .pipe(
        filter((value) => Object.values(value).some((v) => v)),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.isDisabledSubmitBtn = !value.title || !value.time;
        const hours = value.time.split(':')[0];
        if (this._validSpecifiedHour && hours !== this._validSpecifiedHour) {
          this.eventForm
            .get('time')
            ?.setValue(`${this._validSpecifiedHour}${value.time.slice(2)}`);
        }
      });
  }

  private createNewEvent(hours: number, minutes = 0): IScheduledEvent {
    return scheduledEventFactory({
      date: createDateWithSpecifiedTime(this.date, hours, minutes),
      content: '',
      editable: true,
      id: '',
      attendees: [],
      ownerId: this.sessionService.getUserId(),
    });
  }
  private createEventFrom(
    hours: number,
    minutes = 0,
    content: string,
    editable: boolean,
    id: string
  ): IScheduledEvent {
    return scheduledEventFactory({
      date: createDateWithSpecifiedTime(this.date, hours, minutes),
      content,
      editable,
      id,
      attendees: [],
      ownerId: this.sessionService.getUserId(),
  });
  }
}
