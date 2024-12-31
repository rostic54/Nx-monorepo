import {ImportantDate} from "./important-date.model";

export class AddAImportantDate {
  static readonly type = '[IMPORTANT DATE] Add';

  constructor(public payload: ImportantDate) {
  }
}

export class RemoveImportantDate {
  static readonly type = '[IMPORTANT DATE] Remove';

  constructor(public payload: number) {
  }
}

