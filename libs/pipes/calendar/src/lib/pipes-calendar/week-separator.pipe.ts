import { Pipe, PipeTransform } from '@angular/core';
import { IDay } from '@angular-monorepo/types-calendar';

@Pipe({
  name: 'weekSeparator',
  standalone: true
})
export class WeekSeparatorPipe implements PipeTransform {

  transform(calendarDaysArray: IDay[], chunkSize: number): IDay[][] {
    const rowDays: IDay[][] = [];
    let weekDays: IDay[] = [];

    calendarDaysArray.map((day: IDay, index: number) => {
      weekDays.push(day);

      if (++index % chunkSize  === 0) {
        rowDays.push(weekDays);
        weekDays = [];
      }
    });

    return rowDays;
  }

}
