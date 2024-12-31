import {Routes} from "@angular/router";
import {DayDetailsCalendarComponent} from "./day-details-calendar/day-details-calendar.component";
import {GeneralDayInfoComponent} from "./day-details-calendar/pages/general-day-info/general-day-info.component";
import {SpecificHourComponent} from "./day-details-calendar/pages/specific-hour/specific-hour.component";

export const DAY_DETAILS_ROUTES: Routes = [
  {
    path: '',
    component: DayDetailsCalendarComponent,
    children: [
        {path: 'edit', component: GeneralDayInfoComponent },
        {path: 'create/:id', component: SpecificHourComponent },
        {path: '', pathMatch: 'full', redirectTo: 'edit'},
    ]
  },
]
