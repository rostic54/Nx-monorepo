import {Component, EventEmitter, Input, Output, Signal} from '@angular/core';
import {WeekRowsComponent} from "../week-rows/week-rows.component";
import {Month} from "@angular-monorepo/models-calendar";
import {MatButton} from "@angular/material/button";
import { IDay, IDragAndDropEventDetails } from '@angular-monorepo/types-calendar';


@Component({
  selector: 'lib-month',
  standalone: true,
  imports: [
    WeekRowsComponent,
    MatButton
  ],
  templateUrl: './month.component.html',
  styleUrl: './month.component.scss'
})
export class MonthComponent {
  @Input() activeMonth!: Month;
  @Input() days: Signal<IDay[]>;
  @Output() setPreviousMonth: EventEmitter<void> = new EventEmitter<void>();
  @Output() setNextMonth: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateStore: EventEmitter<IDragAndDropEventDetails> = new EventEmitter<IDragAndDropEventDetails>();

  previousMonth() {
    this.setPreviousMonth.emit();
  }

  nextMonth() {
    this.setNextMonth.emit();
  }

  sendUpdateStore(dropDetails: IDragAndDropEventDetails): void {
    this.updateStore.emit(dropDetails);
  }


}
