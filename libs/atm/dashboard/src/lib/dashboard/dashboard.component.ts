import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCardInfo } from '@angular-monorepo/core-atm';
import { UserService, SessionService } from '@angular-monorepo/services-atm';
import { CreditCardComponent } from '@angular-monorepo/ui';
import { Observable, tap, delay, finalize } from 'rxjs';
import { BalanceComponent } from '../components/balance/balance.component';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { WithdrawComponent } from '../components/withdraw/withdraw.component';

@Component({
  selector: 'lib-dashboard',
  imports: [CommonModule, BalanceComponent, TabsModule, CardModule, CreditCardComponent, WithdrawComponent],
  providers: [UserService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  userInfo$: Observable<CommonCardInfo>;

  constructor(private userService: UserService, private sessionService: SessionService) {
  }

  ngOnInit() {
    this.userInfo$ = this.userService.getUserData()
      .pipe(
        tap(() => this.sessionService.loadingStatus = true),
        delay(2000),
        finalize(() => {
          this.sessionService.loadingStatus = false;
        }),
      )
  }}
