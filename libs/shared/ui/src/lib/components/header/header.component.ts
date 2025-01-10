import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SessionService} from "@angular-monorepo/services-atm";
import {Observable} from "rxjs";
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-atm-header',
  imports: [ButtonModule, CommonModule],
  providers: [SessionService],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  loading$: Observable<boolean>;

  get isActive(): boolean {
    return this.sessionService.isSessionActive();
  }

  constructor(private sessionService: SessionService) {
  }

  ngOnInit() {
    this.loading$ = this.sessionService.isLoading;
  }

  exit(): void {
    this.sessionService.logout();
  }
}
