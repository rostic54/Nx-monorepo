import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { BehaviorSubject, catchError, EMPTY, forkJoin, map, Observable, tap } from "rxjs";
import { CommonCardInfo, FinanceDetails, ResponseUserInfo, ResponseFinanceDetails } from "@angular-monorepo/core-atm";
import { NotificationService } from "./notification.service";

@Injectable()
export class UserService {
  // actually use the same api for getting more information. Just example
  private readonly USER_URL = 'https://randomuser.me/api/';
  private readonly USER_FINANCE_URL = 'https://api.coinbase.com/v2/prices/ETH-USD/buy';

  private userFinanceInfo: BehaviorSubject<FinanceDetails> = new BehaviorSubject({
    card_holder: '',
    card_number: '',
    card_type: '',
    id: '',
    card_balance: 0,
  } as FinanceDetails);

  get assetsAmount(): number {
    return this.userFinanceInfo.getValue().card_balance
  }

  get userFinanceInfo$(): Observable<FinanceDetails> {
    return this.userFinanceInfo.asObservable()
  }

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  getUserData(): Observable<CommonCardInfo> {
    return forkJoin(
      {
        user: this.getUserInfo(),
        financeDetails: this.getUserFinanceInfo()
      }).pipe(
        map(({ user, financeDetails }) => {
          const commonCardInfo = {
            card_holder: `${user.first} ${user.last}`,
            card_number: '1234567899876543',
            card_type: 'VISA',
          } as CommonCardInfo;

          this.userFinanceInfo.next({
            id: financeDetails.base,
            card_balance: Number(financeDetails.amount),
            ...commonCardInfo
          } as FinanceDetails);

          return commonCardInfo
        }),
      )
  }

  withdrawMoney(amount: number): Observable<boolean> {
    return this.apiService.post(amount)
      .pipe(
        tap(() => {
          this.updateUserInfo({ card_balance: this.userFinanceInfo.getValue().card_balance - amount })
        }),
        tap(() => this.notificationService.successToast(`Take your ${amount}$`)),
        catchError(err => {
          this.notificationService.errorToast(err.message);
          return EMPTY
        })
      )
  }

  private getUserInfo(): Observable<ResponseUserInfo> {
    return this.apiService.get(this.USER_URL).pipe(
      map(({ results }) => results[0].name)
    )
  }

  private getUserFinanceInfo(): Observable<ResponseFinanceDetails> {
    return this.apiService.get(this.USER_FINANCE_URL).pipe(
      map(({ data }) => data)
    )
  }

  private updateUserInfo(payload: Partial<FinanceDetails>): void {
    this.userFinanceInfo.next({
      ...this.userFinanceInfo.getValue(),
      ...payload
    })
  }
}
