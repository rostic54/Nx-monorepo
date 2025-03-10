import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { CommonModule } from '@angular/common';
import {finalize, Observable} from "rxjs";
import {UserService} from "@angular-monorepo/services-atm";
import { FinanceDetails } from '@angular-monorepo/core-atm';
import { KeyboardComponent } from '@angular-monorepo/ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { PopoverModule } from 'primeng/popover';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'lib-withdraw',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, ButtonModule, PopoverModule, InputIconModule, KeyboardComponent],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawComponent implements OnInit {
  formGroup!: FormGroup;
  // withdrawAmountControl: FormControl;
  maxAmount$: Observable<FinanceDetails>;
  loading = false;

  get withdrawAmountControl(): FormControl {
    return this.formGroup.get('withdrawAmountControl') as FormControl;
  }

  get isWithdrawAmountValid(): boolean {
    return this.withdrawAmountControl.invalid || this.withdrawAmountControl.value <= 0;
  }

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      withdrawAmountControl: new FormControl(0, [Validators.required, Validators.min(0)]),
  });
    this.maxAmount$ = this.userService.userFinanceInfo$;

    this.setAmountValidtor();
  }

  withdraw() {
    this.blockEvents()
    this.userService.withdrawMoney(this.withdrawAmountControl.value)
      .pipe(
        finalize(() => this.unblockEvents()),
      )
      .subscribe(() => {
          this.unblockEvents();
          this.setAmountValidtor();
        }
      );
  }

  private setAmountValidtor(): void {
    this.withdrawAmountControl.setValidators(Validators.max(this.userService.assetsAmount || 0));
    this.withdrawAmountControl.updateValueAndValidity();
  }

  private blockEvents(): void {
    this.loading = true;
    this.withdrawAmountControl.disable();
  }

  private unblockEvents(): void {
    this.loading = false;
    this.withdrawAmountControl.reset(0);
    this.withdrawAmountControl.enable();
  }
}
