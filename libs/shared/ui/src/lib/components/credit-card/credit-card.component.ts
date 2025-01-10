import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonCardInfo} from "@angular-monorepo/core-atm";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-credit-card',
  imports: [CommonModule],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardComponent {
@Input() userInfo: CommonCardInfo;
  showback = false;
}
