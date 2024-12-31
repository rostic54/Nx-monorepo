// export interface ImportantDate {
//   id: number;
//   year: number;
//   month: number;
//   day: number;
// }

export class ImportantDate {
  id: number;
  year: number;
  month: number;
  day: number;
  title: string;

  constructor(timeNow: number, date: Date, title: string) {
    this.id = timeNow;
    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.day = date.getDate();
    this.title = title;
  }
}
