import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'lib-year',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './year.component.html',
  styleUrl: './year.component.scss'
})
export class YearComponent {
  @Input() currentYear: number = new Date().getFullYear();
  @Output() yearBack: EventEmitter<void> = new EventEmitter<void>();
  @Output() yearNext: EventEmitter<void> = new EventEmitter<void>();

  get displayYearValue(): number {
    return this.currentYear
  }
  public previousYear(): void {
    this.yearBack.emit();
  }

  public nextYear(): void {
    this.yearNext.emit();
  }

}
