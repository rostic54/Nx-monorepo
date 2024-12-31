// import {ImportantDate} from "./important-date.model";
// // import {Action, Selector, State, StateContext} from "@ngxs/store";
// import {AddAImportantDate, RemoveImportantDate} from "./important-date.actions";
// import {Injectable} from "@angular/core";
// import {DateManagerService} from "../../../../core/services/date-manager.service";

// export const IMPORTANT_DATE_SATE_NAME = 'importantDate';
// export class ImportantDateStateModel {
//   importantDates: ImportantDate[];
// }

// @State<ImportantDateStateModel>({
//   name: IMPORTANT_DATE_SATE_NAME,
//   defaults: {
//     importantDates: []
//   }
// })

// @Injectable()
// export class ImportantDateState {

//   constructor(private dateManagerService: DateManagerService) {
//   }
//   @Selector()
//   static getImportantDates(state: ImportantDateStateModel) {
//     return state.importantDates
//   }

//   @Action(AddAImportantDate)
//   add({getState, patchState}: StateContext<ImportantDateStateModel>, {payload}: AddAImportantDate) {
//     const state = getState();
//     console.log('STATE HANDLER IN ADD', state)
//     console.log(payload);
//     this.dateManagerService.setDayAsImportant();
//     patchState({
//       importantDates: [...state.importantDates, payload]
//     })
//   }

//   @Action(RemoveImportantDate)
//   remove({getState, patchState}: StateContext<ImportantDateStateModel>, {payload}: RemoveImportantDate) {
//     patchState({
//       importantDates: getState().importantDates.filter(importantDate => importantDate.id !== payload )
//     })
//   }
// }

