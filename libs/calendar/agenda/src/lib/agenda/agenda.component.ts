import { CommonModule, NgClass } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { MonthComponent } from './components/month/month.component';
import { YearComponent } from './components/year/year.component';
import { DateManagerService } from '@angular-monorepo/services-calendar';
import { Day, Month } from '@angular-monorepo/models-calendar';


@Component({
  selector: 'lib-agenda',
  standalone: true,
  imports: [
      MonthComponent,
      YearComponent,
      NgClass,
      CommonModule
    ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent {
  currentDate!: Signal<Date>;
    days!: Signal<Day[]>;
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

    setPreviousYear(): void {
      this.dateManagerService.changeDate(new Date(this.currentDate().getFullYear() - 1, this.activeMonth().currentMonth));
    }

    setNextYear(): void {
      this.dateManagerService.changeDate(new Date(this.currentDate().getFullYear() + 1, this.activeMonth().currentMonth));
    }

    setNextMonth(): void {
      this.dateManagerService.changeDate(new Date(this.currentDate().getFullYear(), this.activeMonth().currentMonth + 1))
    }

    setPreviousMonth(): void {
      this.dateManagerService.changeDate(new Date(this.currentDate().getFullYear(), this.activeMonth().currentMonth - 1))
    }

    updateDaysStore(days: Day[]): void {
      this.dateManagerService.updateDaysInStore(days);
    }

    toggleSelectionMode(): void {
      this.dateManagerService.toggleSelectionMode();
    }
}
