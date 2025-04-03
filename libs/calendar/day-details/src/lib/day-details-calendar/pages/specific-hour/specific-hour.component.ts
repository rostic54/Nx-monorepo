import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateManagerService} from "@angular-monorepo/services-calendar";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {EventCreateFormComponent} from "../../components/event-create-form/event-create-form.component";
import {Subscription} from "rxjs";
import { IDay, IScheduledEvent } from '@angular-monorepo/types-calendar';

@Component({
  selector: 'lib-specific-hour',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSelectModule,
    EventCreateFormComponent,
    RouterLink
  ],
  templateUrl: './specific-hour.component.html',
  styleUrl: './specific-hour.component.scss'
})
export class SpecificHourComponent implements OnInit, OnDestroy {
  hourNumber!: {hours: string};
  currentDate!: IDay;
  subscription = new Subscription();

  constructor(private dateManagerService: DateManagerService,
              private route: ActivatedRoute) {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
   this.subscription = this.route.params.subscribe(routeParams => {
      this.hourNumber = {hours: routeParams['id']};
    });

    this.currentDate = this.dateManagerService.selectedDay();
  }


  createEvent(newEvent: IScheduledEvent): void {
    this.dateManagerService.createEventForParticularDate(newEvent)
  }

}
