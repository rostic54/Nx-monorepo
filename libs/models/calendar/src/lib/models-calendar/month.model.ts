import {MonthName} from "@angular-monorepo/enums-calendar";
import {monthList} from "@angular-monorepo/constants";

export class Month {
  currentMonth: number;
  firstDay: number;
  daysInMonth: number;

  constructor(currentDate: Date) {
    this.currentMonth = currentDate.getMonth();
    this.firstDay = new Date(currentDate.setDate(1)).getDay();
    this.daysInMonth = new Date(currentDate.getFullYear(), this.currentMonth + 1, 0).getDate();
  }

  get monthName(): MonthName {
    return monthList[this.currentMonth];
  }
}
