import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import { IScheduledEvent } from '@angular-monorepo/types-calendar';

@Component({
  selector: 'lib-event-brief-info',
  standalone: true,
  imports: [
    NgIf,
    MatTooltip],
  templateUrl: './event-brief-info.component.html',
  styleUrl: './event-brief-info.component.scss'
})
export class EventBriefInfoComponent {
  @Input() event: IScheduledEvent | undefined;
}
