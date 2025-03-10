import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Subscription,
  retry,
  finalize,
  UnaryFunction,
  Observable,
  pipe,
  concatMap,
  of,
  delay,
} from 'rxjs';
import { Popover, PopoverModule } from 'primeng/popover';
import { InputOtp } from 'primeng/inputotp';
import { MessageService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { Button, ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StatusIcon } from '@angular-monorepo/core-atm';
import { KeyboardComponent } from '@angular-monorepo/ui';
import { PinCodeService } from '@angular-monorepo/services-atm';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-pincode',
  imports: [
    CommonModule,
    PopoverModule,
    InputOtp,
    InputIconModule,
    ButtonModule,
    CardModule,
    FormsModule,
    KeyboardComponent,
    ReactiveFormsModule,
  ],
  providers: [MessageService, PinCodeService],
  templateUrl: './pincode.component.html',
  styleUrl: './pincode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PincodeComponent implements OnInit, OnDestroy {
  pinCode: FormControl;
  pincodeValue: string;
  CODE_LENGTH = 4;
  attempts = 0;
  iconType = StatusIcon.HIDE;
  subscription: Subscription;

  @ViewChild('pinCodeField') myInputField!: ElementRef;
  @ViewChild('panel') panel: Popover;
  @ViewChild('inputRef') input: InputOtp;
  @ViewChild('submitBtn') submitBtn: Button;

  get isDecrypted(): boolean {
    return this.iconType === StatusIcon.SHOW;
  }

  constructor(
    private pinCodeService: PinCodeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggleVisibility(): void {
    this.iconType =
      this.iconType === StatusIcon.HIDE ? StatusIcon.SHOW : StatusIcon.HIDE;
  }

  getStatusIcon(): string {
    switch (this.iconType) {
      case StatusIcon.SHOW:
        return StatusIcon.SHOW;
      case StatusIcon.HIDE:
        return StatusIcon.HIDE;
      case StatusIcon.SPINER:
        return StatusIcon.SPINER;
      case StatusIcon.BAN:
        return StatusIcon.BAN;
      default:
        return StatusIcon.HIDE;
    }
  }

  initForm(): void {
    this.pinCode = new FormControl('', [
      Validators.required,
      Validators.minLength(this.CODE_LENGTH),
    ]);
  }

  setPinCode(event: string): void {
    this.pinCode.setValue(event);
    if (event.length === this.CODE_LENGTH) {
      this.submitBtn.el.nativeElement.focus();
      this.pinCode.disable({ emitEvent: false });
    }
  }

  /***************************************************************************  
   *  ACTIONS
   ****************************************************************************/

  onOtpFocus(event: Event): void {
    if (!this.pinCode.value || this.pinCode.value.length === 0) {
      this.input.el.nativeElement.children[0].focus();
    } else if (
      this.pinCode.value.length > 0 &&
      this.pinCode.value.length < this.CODE_LENGTH
    ) {
      this.input.el.nativeElement.children[this.input.tokens.length].focus();
    }
    event.preventDefault();
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }


  confirmPin(): void {
    this.iconType = StatusIcon.SPINER;
    const code = this.pinCode.value.trim();
    this.subscription = this.pinCodeService
      .sendPinCodeForAudit([...code])
      .pipe(
        this.inputCodeBlock(),
        retry(),
        finalize(() => {
          this.establishControl();
        })
      )
      .subscribe((result: boolean) => {
        if (result) {
          this.router.navigate(['atm', 'dashboard']);
        } else {
          this.attempts++;
          this.establishControl();
        }
      });
  }

  clearPinCode(): void {
    this.pinCode.enable({ emitEvent: false });
    this.pinCode.reset();
    this.cdr.markForCheck();
    setTimeout(() => {
      this.input.el.nativeElement.children[0].focus();
    }, 0);
  }

   /***************************************************************************  
   *  HELPERS
   ****************************************************************************/

  private inputCodeBlock(): UnaryFunction<
    Observable<boolean>,
    Observable<boolean>
  > {
    return pipe(
      concatMap((isCorrectPin: boolean) => {
        if (this.attempts === 3 && !isCorrectPin) {
          this.iconType = StatusIcon.BAN;
          this.attempts = 0;
          this.panel.hide();
          return of(isCorrectPin).pipe(delay(5000));
        }
        return of(isCorrectPin);
      })
    );
  }

  private establishControl(): void {
    this.clearPinCode();

    this.iconType = StatusIcon.HIDE;
  }
}
