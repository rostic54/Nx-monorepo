import { Pipe, PipeTransform } from '@angular/core';
import {Day} from "@angular-monorepo/models-calendar";

@Pipe({
  name: 'weekSeparator',
  standalone: true
})
export class WeekSeparatorPipe implements PipeTransform {

  transform(calendarDaysArray: Day[], chunkSize: number): Day[][] {
    const rowDays: Day[][] = [];
    let weekDays: Day[] = [];

    calendarDaysArray.map((day: Day, index: number) => {
      weekDays.push(day);

      if (++index % chunkSize  === 0) {
        rowDays.push(weekDays);
        weekDays = [];
      }
    });

    return rowDays;
  }

}
