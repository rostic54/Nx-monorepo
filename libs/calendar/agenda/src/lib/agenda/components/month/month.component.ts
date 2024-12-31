import {Component, EventEmitter, Input, Output} from '@angular/core';
import {WeekComponent} from "../week/week.component";
import {Month, Day} from "@angular-monorepo/models-calendar";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'lib-month',
  standalone: true,
  imports: [
    WeekComponent,
    MatButton
  ],
  templateUrl: './month.component.html',
  styleUrl: './month.component.scss'
})
export class MonthComponent {
  @Input() activeMonth!: Month;
  @Input() days: Day[] = [];
  @Output() setPreviousMonth: EventEmitter<void> = new EventEmitter<void>();
  @Output() setNextMonth: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateStore: EventEmitter<Day[]> = new EventEmitter<Day[]>();

  previousMonth() {
    this.setPreviousMonth.emit();
  }

  nextMonth() {
    this.setNextMonth.emit();
  }

  sendUpdateStore(days: Day[]): void {
    this.updateStore.emit(days);
  }


}
