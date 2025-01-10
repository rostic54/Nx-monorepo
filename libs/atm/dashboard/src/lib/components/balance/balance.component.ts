import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {UserService} from "@angular-monorepo/services-atm";
import { Observable } from 'rxjs';
import { FinanceDetails } from '@angular-monorepo/core-atm';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-balance',
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceComponent implements OnInit {
  public userFinanceDetails: Observable<FinanceDetails>;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userFinanceDetails = this.userService.userFinanceInfo$;
  }

}
