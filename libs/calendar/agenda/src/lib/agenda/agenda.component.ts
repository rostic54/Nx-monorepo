import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, Signal, OnInit } from '@angular/core';
import { MonthComponent } from './components/month/month.component';
import { YearComponent } from './components/year/year.component';
import { DateManagerService } from '@angular-monorepo/services-calendar';
import { Month } from '@angular-monorepo/models-calendar';
import { IDay, IDragAndDropEventDetails } from '@angular-monorepo/types-calendar';


@Component({
  selector: 'lib-agenda',
  standalone: true,
  imports: [
      MonthComponent,
      YearComponent,
      NgClass,
      CommonModule
    ],
    providers: [DatePipe],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent implements OnInit {
  currentDate!: Signal<Date>;
    days!: Signal<IDay[]>;
    activeMonth!: Signal<Month>;
    isSelectionModeActive!: Signal<boolean>;

    constructor(private dateManagerService: DateManagerService) {
    }

    ngOnInit() {
      this.currentDate = this.dateManagerService.currentDate;
      this.activeMonth = this.dateManagerService.activeMonth;
      this.days = this.dateManagerService.days;
      this.isSelectionModeActive = this.dateManagerService.isSelectionModeActive;
    }

    private changeDate(yearOffset = 0, monthOffset = 0): void {
      const currentYear = this.currentDate().getFullYear();
      const currentMonth = this.activeMonth().currentMonth;
      this.dateManagerService.changeDate(new Date(currentYear + yearOffset, currentMonth + monthOffset));
    }

    setPreviousYear(): void {
      this.changeDate(-1, 0);
    }

    setNextYear(): void {
      this.changeDate(1, 0);
    }

    setNextMonth(): void {
      this.changeDate(0, 1);
    }

    setPreviousMonth(): void {
      this.changeDate(0, -1);
    }

    updateDaysStore(dropDetails: IDragAndDropEventDetails): void {
      this.dateManagerService.updateRemoteAndLocalStorage(dropDetails);
    }

    toggleSelectionMode(): void {
      this.dateManagerService.toggleSelectionMode();
    }
}
